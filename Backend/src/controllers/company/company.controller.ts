import { Response } from "express";
import z from "zod";
import { prisma } from "../../config/prisma";
import { AuthRequest } from "../../middlewares/loginMiddleware";
import { companyIdSchema, companyProblemQuerySchema } from "../../schemas/company.schema";
import { buildOrderBy, getCompany, problemSelect } from "./company.helper";


export const getAllProblemsFromCompany = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const companyResult = companyIdSchema.safeParse(req.params);

        if (!companyResult.success) {
            return res.status(400).json({
                success: false,
                errors: companyResult.error.flatten().fieldErrors,
            });
        }

        const queryResult = companyProblemQuerySchema.safeParse(req.query);

        if (!queryResult.success) {
            return res.status(400).json({
                success: false,
                errors: queryResult.error.flatten().fieldErrors,
            });
        }

        const { id } = companyResult.data;
        const { difficulty, sortBy, order } = queryResult.data;

        const company = await getCompany(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const whereClause = {
            companies: {
                some: {
                    id: company.id,
                },
            },
            ...(difficulty !== "ALL" && {
                difficulty,
            }),
        };

        const problems = await prisma.problem.findMany({
            where: whereClause,
            select: problemSelect,
            orderBy: buildOrderBy(sortBy, order),
        });

        const userId = req.user?.id;

        let solvedSet = new Set<string>();

        if (userId && problems.length > 0) {
            const solvedProblems = await prisma.solvedProblem.findMany({
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
                solvedProblems.map((sp) => sp.problemId)
            );
        }

        return res.status(200).json({
            success: true,
            data: {
                company,
                totalProblems: problems.length,
                problems: problems.map((problem) => ({
                    ...problem,
                    isSolved: solvedSet.has(problem.id),
                })),
            },
        });
    } catch (error) {
        console.error("[getAllProblemsFromCompany]", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getSolvedProblemFromCompany = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const companyResult = companyIdSchema.safeParse(req.params);

        if (!companyResult.success) {
            return res.status(400).json({
                success: false,
                errors: companyResult.error.flatten().fieldErrors,
            });
        }

        const queryResult = companyProblemQuerySchema.safeParse(req.query);

        if (!queryResult.success) {
            return res.status(400).json({
                success: false,
                errors: queryResult.error.flatten().fieldErrors,
            });
        }

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = companyResult.data;
        const { difficulty, sortBy, order } = queryResult.data;

        const company = await getCompany(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const solvedProblems = await prisma.solvedProblem.findMany({
            where: {
                userId,
                problem: {
                    companies: {
                        some: {
                            id: company.id,
                        },
                    },
                    ...(difficulty !== "ALL" && {
                        difficulty,
                    }),
                },
            },
            select: {
                solvedAt: true,
                problem: {
                    select: problemSelect,
                },
            },
        });

        let problems = solvedProblems.map((sp) => ({
            ...sp.problem,
            solvedAt: sp.solvedAt,
            isSolved: true,
        }));

        if (sortBy === "difficulty") {
            const rank = {
                EASY: 1,
                MEDIUM: 2,
                HARD: 3,
            };

            problems.sort((a, b) =>
                order === "asc"
                    ? rank[a.difficulty] - rank[b.difficulty]
                    : rank[b.difficulty] - rank[a.difficulty]
            );
        } else {
            problems.sort((a, b) =>
                order === "asc"
                    ? a[sortBy] - b[sortBy]
                    : b[sortBy] - a[sortBy]
            );
        }

        return res.status(200).json({
            success: true,
            data: {
                company,
                totalSolved: problems.length,
                problems,
            },
        });
    } catch (error) {
        console.error("[getSolvedProblemFromCompany]", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllUnsolvedProblemFromCompany = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const companyResult = companyIdSchema.safeParse(req.params);

        if (!companyResult.success) {
            return res.status(400).json({
                success: false,
                errors: companyResult.error.flatten().fieldErrors,
            });
        }

        const queryResult = companyProblemQuerySchema.safeParse(req.query);

        if (!queryResult.success) {
            return res.status(400).json({
                success: false,
                errors: queryResult.error.flatten().fieldErrors,
            });
        }

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = companyResult.data;
        const { difficulty, sortBy, order } = queryResult.data;

        const company = await getCompany(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const problems = await prisma.problem.findMany({
            where: {
                companies: {
                    some: {
                        id: company.id,
                    },
                },

                ...(difficulty !== "ALL" && {
                    difficulty,
                }),

                solvedBy: {
                    none: {
                        userId,
                    },
                },
            },
            select: problemSelect,
            orderBy: buildOrderBy(sortBy, order),
        });

        return res.status(200).json({
            success: true,
            data: {
                company,
                totalUnsolved: problems.length,
                problems: problems.map((problem) => ({
                    ...problem,
                    isSolved: false,
                })),
            },
        });
    } catch (error) {
        console.error("[getAllUnsolvedProblemFromCompany]", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const getAllCompanyNameandNumberofproblems = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const companies = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
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
            totalCompanies: companies.length,

            data: companies.map((company) => ({
                id: company.id,
                name: company.name,
                problemCount: company._count.problems,
            })),
        });
    } catch (error) {
        console.error(
            "[getAllCompanyNameandNumberofproblems]",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};