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
        const { difficulty, sortBy, order, period } = queryResult.data;

        const company = await getCompany(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const PeriodMapping: Record<string, string> = {
            "30_days": "THIRTY_DAYS",
            "3_months": "THREE_MONTHS",
            "6_months": "SIX_MONTHS",
            "all": "ALL_TIME",
        };

        const whereClause = {
            companyProblems: {
                some: {
                    companyId: company.id,
                    ...(period !== "all" && {
                        period: PeriodMapping[period] as any,
                    }),
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
                problems: problems.map((problem) => {
                    const { companyProblems, ...rest } = problem;
                    const cpForCompany = companyProblems.find((cp) => 
                        cp.company.slug === company.slug &&
                        (period === "all" || cp.period === PeriodMapping[period])
                    );
                    const frequency = cpForCompany ? cpForCompany.frequency : 0;
                    const companies = companyProblems.map((cp) => cp.company);
                    return {
                        ...rest,
                        frequency,
                        companies,
                        isSolved: solvedSet.has(problem.id),
                    };
                }),
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
        const { difficulty, sortBy, order, period } = queryResult.data;

        const company = await getCompany(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const PeriodMapping: Record<string, string> = {
            "30_days": "THIRTY_DAYS",
            "3_months": "THREE_MONTHS",
            "6_months": "SIX_MONTHS",
            "all": "ALL_TIME",
        };

        const solvedProblems = await prisma.solvedProblem.findMany({
            where: {
                userId,
                problem: {
                    companyProblems: {
                        some: {
                            companyId: company.id,
                            ...(period !== "all" && {
                                period: PeriodMapping[period] as any,
                            }),
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

        let problems = solvedProblems.map((sp) => {
            const { companyProblems, ...rest } = sp.problem;
            const cpForCompany = companyProblems.find((cp) => 
                cp.company.slug === company.slug &&
                (period === "all" || cp.period === PeriodMapping[period])
            );
            const frequency = cpForCompany ? cpForCompany.frequency : 0;
            const companies = companyProblems.map((cp) => cp.company);
            return {
                ...rest,
                frequency,
                companies,
                solvedAt: sp.solvedAt,
                isSolved: true,
            };
        });

        if (sortBy === "difficulty") {
            const rank = {
                EASY: 1,
                MEDIUM: 2,
                HARD: 3,
            };

            problems.sort((a, b) =>
                order === "asc"
                    ? rank[a.difficulty as keyof typeof rank] - rank[b.difficulty as keyof typeof rank]
                    : rank[b.difficulty as keyof typeof rank] - rank[a.difficulty as keyof typeof rank]
            );
        } else {
            problems.sort((a, b) => {
                const valA = sortBy === "acceptanceRate" ? a.acceptanceRate : a.frequency;
                const valB = sortBy === "acceptanceRate" ? b.acceptanceRate : b.frequency;
                return order === "asc" ? valA - valB : valB - valA;
            });
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
        const { difficulty, sortBy, order, period } = queryResult.data;

        const company = await getCompany(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const PeriodMapping: Record<string, string> = {
            "30_days": "THIRTY_DAYS",
            "3_months": "THREE_MONTHS",
            "6_months": "SIX_MONTHS",
            "all": "ALL_TIME",
        };

        const problems = await prisma.problem.findMany({
            where: {
                companyProblems: {
                    some: {
                        companyId: company.id,
                        ...(period !== "all" && {
                            period: PeriodMapping[period] as any,
                        }),
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
                problems: problems.map((problem) => {
                    const { companyProblems, ...rest } = problem;
                    const cpForCompany = companyProblems.find((cp) => 
                        cp.company.slug === company.slug &&
                        (period === "all" || cp.period === PeriodMapping[period])
                    );
                    const frequency = cpForCompany ? cpForCompany.frequency : 0;
                    const companies = companyProblems.map((cp) => cp.company);
                    return {
                        ...rest,
                        frequency,
                        companies,
                        isSolved: false,
                    };
                }),
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
                        companyProblems: true,
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
                problemCount: company._count.companyProblems,
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

export const getCompanyDetails = async (
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

        const { id } = companyResult.data;
        const company = await getCompany(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        // Count total unique problems across all durations for this company
        const totalProblems = await prisma.companyProblem.count({
            where: {
                companyId: company.id,
            },
        });

        // Get unique periods available in the database for this company
        const periods = await prisma.companyProblem.findMany({
            where: {
                companyId: company.id,
            },
            select: {
                period: true,
            },
            distinct: ["period"],
        });

        const periodMappingReverse: Record<string, string> = {
            THIRTY_DAYS: "30_days",
            THREE_MONTHS: "3_months",
            SIX_MONTHS: "6_months",
            ALL_TIME: "all",
        };

        const durationsAvailable = periods.map(p => periodMappingReverse[p.period]).filter(Boolean);

        return res.status(200).json({
            success: true,
            data: {
                id: company.id,
                company: company.name,
                slug: company.slug,
                imageUrl: company.imageUrl,
                total_records_across_durations: totalProblems,
                durations_available: durationsAvailable,
            },
        });
    } catch (error) {
        console.error("[getCompanyDetails]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};