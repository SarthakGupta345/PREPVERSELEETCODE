import { prisma } from "../../config/prisma";

export const problemSelect = {
    id: true,
    title: true,
    slug: true,
    difficulty: true,
    acceptanceRate: true,
    link: true,

    companyProblems: {
        select: {
            frequency: true,
            company: {
                select: {
                    name: true,
                    slug: true,
                },
            },
        },
    },

    topics: {
        select: {
            name: true,
            slug: true,
        },
    },
} as const;

export const mapProblemData = (problems: any[]) => {
    return problems.map((p: any) => {
        const companyMap = new Map<string, { name: string; slug: string }>();
        if (p.companyProblems) {
            p.companyProblems.forEach((cp: any) => {
                if (cp.company) {
                    companyMap.set(cp.company.name, cp.company);
                }
            });
        }
        const companies = Array.from(companyMap.values());
        const maxFrequency = p.companyProblems && p.companyProblems.length > 0
            ? Math.max(...p.companyProblems.map((cp: any) => cp.frequency))
            : 0.0;

        const { companyProblems, ...rest } = p;
        return {
            ...rest,
            companies,
            frequency: maxFrequency,
        };
    });
};


export const addSolvedStatus = async (
    problems: Array<{ id: string }>,
    userId?: string
) => {
    if (!userId || problems.length === 0) {
        return problems.map(problem => ({
            ...problem,
            isSolved: false,
        }));
    }

    const solvedProblems =
        await prisma.solvedProblem.findMany({
            where: {
                userId,
                problemId: {
                    in: problems.map((p) => p.id),
                },
            },
            select: {
                problemId: true,
            },
        });

    const solvedSet = new Set(
        solvedProblems.map((sp) => sp.problemId)
    );

    return problems.map(problem => ({
        ...problem,
        isSolved: solvedSet.has(problem.id),
    }));
};
