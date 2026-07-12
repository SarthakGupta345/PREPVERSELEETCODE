"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCompanyNameandNumberofproblems = exports.getAllUnsolvedProblemFromCompany = exports.getSolvedProblemFromCompany = exports.getAllProblemsFromCompany = void 0;
const prisma_1 = require("../../config/prisma");
const company_schema_1 = require("../../schemas/company.schema");
const company_helper_1 = require("./company.helper");
const getAllProblemsFromCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyResult = company_schema_1.companyIdSchema.safeParse(req.params);
        if (!companyResult.success) {
            return res.status(400).json({
                success: false,
                errors: companyResult.error.flatten().fieldErrors,
            });
        }
        const queryResult = company_schema_1.companyProblemQuerySchema.safeParse(req.query);
        if (!queryResult.success) {
            return res.status(400).json({
                success: false,
                errors: queryResult.error.flatten().fieldErrors,
            });
        }
        const { id } = companyResult.data;
        const { difficulty, sortBy, order } = queryResult.data;
        const company = yield (0, company_helper_1.getCompany)(id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }
        const whereClause = Object.assign({ companyProblems: {
                some: {
                    companyId: company.id,
                },
            } }, (difficulty !== "ALL" && {
            difficulty,
        }));
        const problems = yield prisma_1.prisma.problem.findMany({
            where: whereClause,
            select: company_helper_1.problemSelect,
            orderBy: (0, company_helper_1.buildOrderBy)(sortBy, order),
        });
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let solvedSet = new Set();
        if (userId && problems.length > 0) {
            const solvedProblems = yield prisma_1.prisma.solvedProblem.findMany({
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
            solvedSet = new Set(solvedProblems.map((sp) => sp.problemId));
        }
        return res.status(200).json({
            success: true,
            data: {
                company,
                totalProblems: problems.length,
                problems: problems.map((problem) => {
                    const { companyProblems } = problem, rest = __rest(problem, ["companyProblems"]);
                    const cpForCompany = companyProblems.find((cp) => cp.company.slug === company.slug);
                    const frequency = cpForCompany ? cpForCompany.frequency : 0;
                    const companies = companyProblems.map((cp) => cp.company);
                    return Object.assign(Object.assign({}, rest), { frequency,
                        companies, isSolved: solvedSet.has(problem.id) });
                }),
            },
        });
    }
    catch (error) {
        console.error("[getAllProblemsFromCompany]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getAllProblemsFromCompany = getAllProblemsFromCompany;
const getSolvedProblemFromCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyResult = company_schema_1.companyIdSchema.safeParse(req.params);
        if (!companyResult.success) {
            return res.status(400).json({
                success: false,
                errors: companyResult.error.flatten().fieldErrors,
            });
        }
        const queryResult = company_schema_1.companyProblemQuerySchema.safeParse(req.query);
        if (!queryResult.success) {
            return res.status(400).json({
                success: false,
                errors: queryResult.error.flatten().fieldErrors,
            });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const { id } = companyResult.data;
        const { difficulty, sortBy, order } = queryResult.data;
        const company = yield (0, company_helper_1.getCompany)(id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }
        const solvedProblems = yield prisma_1.prisma.solvedProblem.findMany({
            where: {
                userId,
                problem: Object.assign({ companyProblems: {
                        some: {
                            companyId: company.id,
                        },
                    } }, (difficulty !== "ALL" && {
                    difficulty,
                })),
            },
            select: {
                solvedAt: true,
                problem: {
                    select: company_helper_1.problemSelect,
                },
            },
        });
        let problems = solvedProblems.map((sp) => {
            const _a = sp.problem, { companyProblems } = _a, rest = __rest(_a, ["companyProblems"]);
            const cpForCompany = companyProblems.find((cp) => cp.company.slug === company.slug);
            const frequency = cpForCompany ? cpForCompany.frequency : 0;
            const companies = companyProblems.map((cp) => cp.company);
            return Object.assign(Object.assign({}, rest), { frequency,
                companies, solvedAt: sp.solvedAt, isSolved: true });
        });
        if (sortBy === "difficulty") {
            const rank = {
                EASY: 1,
                MEDIUM: 2,
                HARD: 3,
            };
            problems.sort((a, b) => order === "asc"
                ? rank[a.difficulty] - rank[b.difficulty]
                : rank[b.difficulty] - rank[a.difficulty]);
        }
        else {
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
    }
    catch (error) {
        console.error("[getSolvedProblemFromCompany]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getSolvedProblemFromCompany = getSolvedProblemFromCompany;
const getAllUnsolvedProblemFromCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyResult = company_schema_1.companyIdSchema.safeParse(req.params);
        if (!companyResult.success) {
            return res.status(400).json({
                success: false,
                errors: companyResult.error.flatten().fieldErrors,
            });
        }
        const queryResult = company_schema_1.companyProblemQuerySchema.safeParse(req.query);
        if (!queryResult.success) {
            return res.status(400).json({
                success: false,
                errors: queryResult.error.flatten().fieldErrors,
            });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const { id } = companyResult.data;
        const { difficulty, sortBy, order } = queryResult.data;
        const company = yield (0, company_helper_1.getCompany)(id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }
        const problems = yield prisma_1.prisma.problem.findMany({
            where: Object.assign(Object.assign({ companyProblems: {
                    some: {
                        companyId: company.id,
                    },
                } }, (difficulty !== "ALL" && {
                difficulty,
            })), { solvedBy: {
                    none: {
                        userId,
                    },
                } }),
            select: company_helper_1.problemSelect,
            orderBy: (0, company_helper_1.buildOrderBy)(sortBy, order),
        });
        return res.status(200).json({
            success: true,
            data: {
                company,
                totalUnsolved: problems.length,
                problems: problems.map((problem) => {
                    const { companyProblems } = problem, rest = __rest(problem, ["companyProblems"]);
                    const cpForCompany = companyProblems.find((cp) => cp.company.slug === company.slug);
                    const frequency = cpForCompany ? cpForCompany.frequency : 0;
                    const companies = companyProblems.map((cp) => cp.company);
                    return Object.assign(Object.assign({}, rest), { frequency,
                        companies, isSolved: false });
                }),
            },
        });
    }
    catch (error) {
        console.error("[getAllUnsolvedProblemFromCompany]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getAllUnsolvedProblemFromCompany = getAllUnsolvedProblemFromCompany;
const getAllCompanyNameandNumberofproblems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield prisma_1.prisma.company.findMany({
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
    }
    catch (error) {
        console.error("[getAllCompanyNameandNumberofproblems]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getAllCompanyNameandNumberofproblems = getAllCompanyNameandNumberofproblems;
