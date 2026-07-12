"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const p_limit_1 = __importDefault(require("p-limit"));
// Enums mapping
const DifficultyMap = {
    Easy: "EASY",
    Medium: "MEDIUM",
    Hard: "HARD",
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
};
const PeriodMap = {
    "30_days": "THIRTY_DAYS",
    "3_months": "THREE_MONTHS",
    "6_months": "SIX_MONTHS",
    "all": "ALL_TIME",
};
const getSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting database ingestion...");
        const dataPath = path.resolve(__dirname, "../../../client/src/constants/data");
        const topicsPath = path.join(dataPath, "globalTopics.json");
        const problemsPath = path.join(dataPath, "globalProblems.json");
        const companiesIndexPath = path.join(dataPath, "companiesIndex.json");
        const companiesDir = path.join(dataPath, "companies");
        // 1. Ingest Topics
        console.log("Ingesting topics...");
        const rawTopics = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
        const topicMap = new Map(); // name -> id
        for (const t of rawTopics) {
            const topicSlug = getSlug(t.name);
            const topic = yield prisma_1.prisma.topic.upsert({
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
        const companyMap = new Map(); // name -> id
        for (const c of rawCompaniesIndex) {
            const companySlug = getSlug(c.name);
            const company = yield prisma_1.prisma.company.upsert({
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
        const problemMap = new Map(); // title -> id
        const limit = (0, p_limit_1.default)(20); // concurrency limit
        const problemPromises = rawProblems.map((p) => {
            return limit(() => __awaiter(this, void 0, void 0, function* () {
                const problemSlug = p.link && p.link.includes("/problems/")
                    ? p.link.split("/problems/")[1].replace(/\/+$/, "")
                    : getSlug(p.title);
                const difficulty = DifficultyMap[p.difficulty] || "MEDIUM";
                const acceptanceRate = p.acceptance ? parseFloat(p.acceptance) / 100 : 0.0;
                const frequency = p.frequency ? parseFloat(p.frequency) : 0.0;
                const topicsToConnect = p.topics
                    ? p.topics.map((tName) => ({ name: tName })).filter((t) => topicMap.has(t.name))
                    : [];
                const problem = yield prisma_1.prisma.problem.upsert({
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
            }));
        });
        yield Promise.all(problemPromises);
        console.log(`Successfully ingested/verified ${problemMap.size} problems.`);
        // 4. Ingest Company-specific Problems (CompanyProblem relations)
        console.log("Ingesting company-specific problems...");
        const companyFiles = fs.readdirSync(companiesDir).filter(f => f.endsWith(".json"));
        console.log(`Found ${companyFiles.length} company data files.`);
        const companyProblemLimit = (0, p_limit_1.default)(10);
        let totalRelationsCreated = 0;
        const companyProblemPromises = companyFiles.map((file) => {
            return companyProblemLimit(() => __awaiter(this, void 0, void 0, function* () {
                const filePath = path.join(companiesDir, file);
                const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                const companyName = content.company;
                let companyId = companyMap.get(companyName);
                if (!companyId) {
                    // If not in index, create it
                    const companySlug = getSlug(companyName);
                    const company = yield prisma_1.prisma.company.upsert({
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
                    if (!periodEnum)
                        continue;
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
                                ? rec.Topics.split(",").map((t) => t.trim()).filter(Boolean)
                                : [];
                            // Upsert topics on the fly if needed
                            const topicsToConnect = [];
                            for (const tName of recTopics) {
                                let tid = topicMap.get(tName);
                                if (!tid) {
                                    const topicSlug = getSlug(tName);
                                    const topic = yield prisma_1.prisma.topic.upsert({
                                        where: { name: tName },
                                        update: {},
                                        create: { name: tName, slug: topicSlug },
                                    });
                                    topicMap.set(tName, topic.id);
                                }
                                topicsToConnect.push({ name: tName });
                            }
                            const problem = yield prisma_1.prisma.problem.upsert({
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
                        yield prisma_1.prisma.companyProblem.upsert({
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
            }));
        });
        yield Promise.all(companyProblemPromises);
        console.log(`Successfully ingested/verified ${totalRelationsCreated} Company-Problem relations.`);
        console.log("Database ingestion completed successfully!");
    });
}
main()
    .catch((e) => {
    console.error("Error during ingestion:", e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.$disconnect();
}));
