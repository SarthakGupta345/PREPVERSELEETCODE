import { AuthRequest } from "../../middlewares/loginMiddleware";
import { Response } from "express";
import { problemQuerySchema } from "../../schemas/problem.schema";
import { prisma } from "../../config/prisma";
import { addSolvedStatus, problemSelect, mapProblemData } from "./problem.helper";
import { idSchema, topicSchema } from "../../schemas/generalSchema";


export const getAllProblems = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const queryData =
            problemQuerySchema.safeParse(req.query);

        if (!queryData.success) {
            return res.status(400).json({
                success: false,
                errors:
                    queryData.error.flatten().fieldErrors,
            });
        }

        const {
            page,
            limit,
            difficulty,
            sortBy,
            order,
        } = queryData.data;

        const skip = (page - 1) * limit;

        const whereClause = {
            ...(difficulty !== "ALL" && {
                difficulty,
            }),
        };

        const [totalProblems, problems] =
            await Promise.all([
                prisma.problem.count({
                    where: whereClause,
                }),

                prisma.problem.findMany({
                    where: whereClause,

                    select: problemSelect,

                    orderBy: sortBy === "acceptanceRate"
                        ? { acceptanceRate: order }
                        : { id: "asc" },

                    skip,
                    take: limit,
                }),
            ]);

        const problemsWithSolvedStatus =
            await addSolvedStatus(
                mapProblemData(problems),
                req.user?.id
            );

        return res.status(200).json({
            success: true,

            pagination: {
                page,
                limit,
                totalProblems,
                totalPages: Math.ceil(
                    totalProblems / limit
                ),
                hasNextPage:
                    skip + problems.length <
                    totalProblems,
            },

            data: problemsWithSolvedStatus,
        });
    } catch (error) {
        console.error("[getAllProblems]", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const markProblemDone = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const problemData = idSchema.safeParse(req.params);

        if (!problemData.success) {
            return res.status(400).json({
                success: false,
                errors: problemData.error.flatten().fieldErrors,
            });
        }

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const problemId = problemData.data.id;

        const problem = await prisma.problem.findUnique({
            where: {
                id: problemId,
            },
            select: {
                id: true,
            },
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        const existing = await prisma.solvedProblem.findUnique({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                },
            },
        });

        if (existing) {
            return res.status(200).json({
                success: true,
                message: "Problem already marked as done",
            });
        }

        await prisma.solvedProblem.create({
            data: {
                userId,
                problemId,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Problem marked as done",
        });
    } catch (error) {
        console.error("[markProblemDone]", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const getAllProblemsFromTopic = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const topicData = topicSchema.safeParse(req.params);

        if (!topicData.success) {
            return res.status(400).json({
                success: false,
                errors: topicData.error.flatten().fieldErrors,
            });
        }

        const queryData = problemQuerySchema.safeParse(req.query);

        if (!queryData.success) {
            return res.status(400).json({
                success: false,
                errors: queryData.error.flatten().fieldErrors,
            });
        }

        const topic = topicData.data.topic;

        const {
            page,
            limit,
            difficulty,
            sortBy,
            order,
        } = queryData.data;

        const skip = (page - 1) * limit;

        const whereClause = {
            topics: {
                some: {
                    name: topic,
                },
            },

            ...(difficulty !== "ALL" && {
                difficulty,
            }),
        };

        const [totalProblems, problems] =
            await Promise.all([
                prisma.problem.count({
                    where: whereClause,
                }),

                prisma.problem.findMany({
                    where: whereClause,

                    select: problemSelect,

                    orderBy: sortBy === "acceptanceRate"
                        ? { acceptanceRate: order }
                        : { id: "asc" },

                    skip,
                    take: limit,
                }),
            ]);

        if (totalProblems === 0) {
            return res.status(404).json({
                success: false,
                message: `No problems found for topic "${topic}"`,
            });
        }

        const userId = req.user?.id;

        let solvedSet = new Set<string>();

        if (userId && problems.length > 0) {
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

            solvedSet = new Set(
                solvedProblems.map(
                    (problem) => problem.problemId
                )
            );
        }

        return res.status(200).json({
            success: true,

            pagination: {
                page,
                limit,
                totalProblems,

                totalPages: Math.ceil(
                    totalProblems / limit
                ),

                hasNextPage:
                    skip + problems.length <
                    totalProblems,

                hasPreviousPage: page > 1,
            },

            data: mapProblemData(problems).map((problem) => ({
                ...problem,
                isSolved: solvedSet.has(problem.id),
            })),
        });
    } catch (error) {
        console.error("[getAllProblemsFromTopic]", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const markProblemUndone = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const problemData = idSchema.safeParse(req.params);

        if (!problemData.success) {
            return res.status(400).json({
                success: false,
                errors: problemData.error.flatten().fieldErrors,
            });
        }

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const problemId = problemData.data.id;

        const deleted = await prisma.solvedProblem.deleteMany({
            where: {
                userId,
                problemId,
            },
        });

        if (deleted.count === 0) {
            return res.status(404).json({
                success: false,
                message: "Problem not solved yet",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem marked as undone",
        });
    } catch (error) {
        console.error("[markProblemUndone]", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const fetchAllTopicsAndNumberOfProblemsCount = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const topics = await prisma.topic.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                    select: {
                        problems: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return res.status(200).json({
            success: true,
            totalTopics: topics.length,
            data: topics.map((topic) => ({
                id: topic.id,
                name: topic.name,
                slug: topic.slug,
                problemCount: topic._count.problems,
            })),
        });
    } catch (error) {
        console.error(
            "[fetchAllTopicsAndNumberOfProblemsCount]",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};