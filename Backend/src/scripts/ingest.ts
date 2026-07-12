import { prisma } from "../config/prisma";
import * as fs from "fs";
import * as path from "path";
import pLimit from "p-limit";

// Enums mapping
const DifficultyMap: Record<string, "EASY" | "MEDIUM" | "HARD"> = {
    Easy: "EASY",
    Medium: "MEDIUM",
    Hard: "HARD",
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
};

const PeriodMap: Record<string, "THIRTY_DAYS" | "THREE_MONTHS" | "SIX_MONTHS" | "ALL_TIME"> = {
    "30_days": "THIRTY_DAYS",
    "3_months": "THREE_MONTHS",
    "6_months": "SIX_MONTHS",
    "all": "ALL_TIME",
};

const getSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

async function main() {
    console.log("Starting database ingestion...");

    const dataPath = path.resolve(__dirname, "../../../client/src/constants/data");
    const topicsPath = path.join(dataPath, "globalTopics.json");
    const problemsPath = path.join(dataPath, "globalProblems.json");
    const companiesIndexPath = path.join(dataPath, "companiesIndex.json");
    const companiesDir = path.join(dataPath, "companies");

    // 1. Ingest Topics
    console.log("Ingesting topics...");
    const rawTopics = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
    const topicMap = new Map<string, string>(); // name -> id

    for (const t of rawTopics) {
        const topicSlug = getSlug(t.name);
        const topic = await prisma.topic.upsert({
            where: { name: t.name },
            update: {},
            create: {
                name: t.name,
                slug: topicSlug,
            },
        });
        topicMap.set(t.name, topic.id);
    }
    console.log(`Successfully ingested/verified ${topicMap.size} topics.`);

    // 2. Ingest Companies Index
    console.log("Ingesting companies from index...");
    const rawCompaniesIndex = JSON.parse(fs.readFileSync(companiesIndexPath, "utf-8"));
    const companyMap = new Map<string, string>(); // name -> id

    for (const c of rawCompaniesIndex) {
        const companySlug = getSlug(c.name);
        const company = await prisma.company.upsert({
            where: { name: c.name },
            update: {},
            create: {
                name: c.name,
                slug: companySlug,
            },
        });
        companyMap.set(c.name, company.id);
    }
    console.log(`Successfully ingested/verified ${companyMap.size} companies.`);

    // 3. Ingest Problems
    console.log("Ingesting problems...");
    const rawProblems = JSON.parse(fs.readFileSync(problemsPath, "utf-8"));
    console.log(`Total problems in JSON: ${rawProblems.length}`);

    const problemMap = new Map<string, string>(); // title -> id
    const limit = pLimit(20); // concurrency limit

    const problemPromises = rawProblems.map((p: any) => {
        return limit(async () => {
            const problemSlug = p.link && p.link.includes("/problems/")
                ? p.link.split("/problems/")[1].replace(/\/+$/, "")
                : getSlug(p.title);

            const difficulty = DifficultyMap[p.difficulty] || "MEDIUM";
            const acceptanceRate = p.acceptance ? parseFloat(p.acceptance) / 100 : 0.0;
            const frequency = p.frequency ? parseFloat(p.frequency) : 0.0;

            const topicsToConnect = p.topics
                ? p.topics.map((tName: string) => ({ name: tName })).filter((t: any) => topicMap.has(t.name))
                : [];

            const problem = await prisma.problem.upsert({
                where: { slug: problemSlug },
                update: {
                    title: p.title,
                    difficulty,
                    acceptanceRate,
                    link: p.link || "",
                },
                create: {
                    id: String(p.id),
                    title: p.title,
                    slug: problemSlug,
                    description: "",
                    difficulty,
                    acceptanceRate,
                    link: p.link || "",
                    topics: {
                        connect: topicsToConnect,
                    },
                },
            });
            problemMap.set(p.title.toLowerCase().trim(), problem.id);
        });
    });

    await Promise.all(problemPromises);
    console.log(`Successfully ingested/verified ${problemMap.size} problems.`);

    // 4. Ingest Company-specific Problems (CompanyProblem relations)
    console.log("Ingesting company-specific problems...");
    const companyFiles = fs.readdirSync(companiesDir).filter(f => f.endsWith(".json"));
    console.log(`Found ${companyFiles.length} company data files.`);

    const companyProblemLimit = pLimit(10);
    let totalRelationsCreated = 0;

    const companyProblemPromises = companyFiles.map((file) => {
        return companyProblemLimit(async () => {
            const filePath = path.join(companiesDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const companyName = content.company;

            let companyId = companyMap.get(companyName);
            if (!companyId) {
                // If not in index, create it
                const companySlug = getSlug(companyName);
                const company = await prisma.company.upsert({
                    where: { name: companyName },
                    update: {},
                    create: {
                        name: companyName,
                        slug: companySlug,
                    },
                });
                companyId = company.id;
                companyMap.set(companyName, companyId);
            }

            const dataObj = content.data || {};
            for (const durationKey of Object.keys(dataObj)) {
                const periodEnum = PeriodMap[durationKey];
                if (!periodEnum) continue;

                const durationData = dataObj[durationKey];
                const records = durationData.records || [];

                for (const rec of records) {
                    const titleKey = rec.Title.toLowerCase().trim();
                    let problemId = problemMap.get(titleKey);

                    if (!problemId) {
                        // Create problem on the fly if not found in globalProblems
                        const problemSlug = rec.Link && rec.Link.includes("/problems/")
                            ? rec.Link.split("/problems/")[1].replace(/\/+$/, "")
                            : getSlug(rec.Title);

                        const difficulty = DifficultyMap[rec.Difficulty] || "MEDIUM";
                        const acceptanceRate = rec["Acceptance Rate"] ? parseFloat(rec["Acceptance Rate"]) : 0.0;

                        const recTopics = rec.Topics
                            ? rec.Topics.split(",").map((t: string) => t.trim()).filter(Boolean)
                            : [];

                        // Upsert topics on the fly if needed
                        const topicsToConnect = [];
                        for (const tName of recTopics) {
                            let tid = topicMap.get(tName);
                            if (!tid) {
                                const topicSlug = getSlug(tName);
                                const topic = await prisma.topic.upsert({
                                    where: { name: tName },
                                    update: {},
                                    create: { name: tName, slug: topicSlug },
                                });
                                topicMap.set(tName, topic.id);
                            }
                            topicsToConnect.push({ name: tName });
                        }

                        const problem = await prisma.problem.upsert({
                            where: { slug: problemSlug },
                            update: {},
                            create: {
                                title: rec.Title,
                                slug: problemSlug,
                                description: "",
                                difficulty,
                                acceptanceRate,
                                link: rec.Link || "",
                                topics: {
                                    connect: topicsToConnect,
                                },
                            },
                        });
                        problemId = problem.id;
                        problemMap.set(titleKey, problemId);
                    }

                    const frequency = rec.Frequency ? parseFloat(rec.Frequency) : 0.0;

                    await prisma.companyProblem.upsert({
                        where: {
                            companyId_problemId_period: {
                                companyId,
                                problemId,
                                period: periodEnum,
                            },
                        },
                        update: {
                            frequency,
                        },
                        create: {
                            companyId,
                            problemId,
                            period: periodEnum,
                            frequency,
                        },
                    });
                    totalRelationsCreated++;
                }
            }
        });
    });

    await Promise.all(companyProblemPromises);
    console.log(`Successfully ingested/verified ${totalRelationsCreated} Company-Problem relations.`);
    console.log("Database ingestion completed successfully!");
}

main()
    .catch((e) => {
        console.error("Error during ingestion:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
