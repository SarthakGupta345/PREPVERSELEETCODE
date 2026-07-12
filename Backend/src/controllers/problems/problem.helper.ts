import { prisma } from "../../config/prisma";

export const problemSelect = {
    id: true,
    title: true,
    slug: true,
    difficulty: true,
    frequency: true,
    acceptanceRate: true,
    link: true,

    companies: {
        select: {
            name: true,
            slug: true,
        },
    },

    topics: {
        select: {
            name: true,
            slug: true,
        },
    },
} as const;


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
