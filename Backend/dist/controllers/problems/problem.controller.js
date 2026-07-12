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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllTopicsAndNumberOfProblemsCount = exports.markProblemUndone = exports.getAllProblemsFromTopic = exports.markProblemDone = exports.getAllProblems = void 0;
const problem_schema_1 = require("../../schemas/problem.schema");
const prisma_1 = require("../../config/prisma");
const problem_helper_1 = require("./problem.helper");
const generalSchema_1 = require("../../schemas/generalSchema");
const getAllProblems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const queryData = problem_schema_1.problemQuerySchema.safeParse(req.query);
        if (!queryData.success) {
            return res.status(400).json({
                success: false,
                errors: queryData.error.flatten().fieldErrors,
            });
        }
        const { page, limit, difficulty, sortBy, order, } = queryData.data;
        const skip = (page - 1) * limit;
        const whereClause = Object.assign({}, (difficulty !== "ALL" && {
            difficulty,
        }));
        const [totalProblems, problems] = yield Promise.all([
            prisma_1.prisma.problem.count({
                where: whereClause,
            }),
            prisma_1.prisma.problem.findMany({
                where: whereClause,
                select: problem_helper_1.problemSelect,
                orderBy: sortBy === "acceptanceRate"
                    ? { acceptanceRate: order }
                    : { id: "asc" },
                skip,
                take: limit,
            }),
        ]);
        const problemsWithSolvedStatus = yield (0, problem_helper_1.addSolvedStatus)((0, problem_helper_1.mapProblemData)(problems), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                totalProblems,
                totalPages: Math.ceil(totalProblems / limit),
                hasNextPage: skip + problems.length <
                    totalProblems,
            },
            data: problemsWithSolvedStatus,
        });
    }
    catch (error) {
        console.error("[getAllProblems]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getAllProblems = getAllProblems;
const markProblemDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const problemData = generalSchema_1.idSchema.safeParse(req.params);
        if (!problemData.success) {
            return res.status(400).json({
                success: false,
                errors: problemData.error.flatten().fieldErrors,
            });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const problemId = problemData.data.id;
        const problem = yield prisma_1.prisma.problem.findUnique({
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
        const existing = yield prisma_1.prisma.solvedProblem.findUnique({
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
        yield prisma_1.prisma.solvedProblem.create({
            data: {
                userId,
                problemId,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Problem marked as done",
        });
    }
    catch (error) {
        console.error("[markProblemDone]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.markProblemDone = markProblemDone;
const getAllProblemsFromTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const topicData = generalSchema_1.topicSchema.safeParse(req.params);
        if (!topicData.success) {
            return res.status(400).json({
                success: false,
                errors: topicData.error.flatten().fieldErrors,
            });
        }
        const queryData = problem_schema_1.problemQuerySchema.safeParse(req.query);
        if (!queryData.success) {
            return res.status(400).json({
                success: false,
                errors: queryData.error.flatten().fieldErrors,
            });
        }
        const topic = topicData.data.topic;
        const { page, limit, difficulty, sortBy, order, } = queryData.data;
        const skip = (page - 1) * limit;
        const whereClause = Object.assign({ topics: {
                some: {
                    name: topic,
                },
            } }, (difficulty !== "ALL" && {
            difficulty,
        }));
        const [totalProblems, problems] = yield Promise.all([
            prisma_1.prisma.problem.count({
                where: whereClause,
            }),
            prisma_1.prisma.problem.findMany({
                where: whereClause,
                select: problem_helper_1.problemSelect,
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
            solvedSet = new Set(solvedProblems.map((problem) => problem.problemId));
        }
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                totalProblems,
                totalPages: Math.ceil(totalProblems / limit),
                hasNextPage: skip + problems.length <
                    totalProblems,
                hasPreviousPage: page > 1,
            },
            data: (0, problem_helper_1.mapProblemData)(problems).map((problem) => (Object.assign(Object.assign({}, problem), { isSolved: solvedSet.has(problem.id) }))),
        });
    }
    catch (error) {
        console.error("[getAllProblemsFromTopic]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getAllProblemsFromTopic = getAllProblemsFromTopic;
const markProblemUndone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const problemData = generalSchema_1.idSchema.safeParse(req.params);
        if (!problemData.success) {
            return res.status(400).json({
                success: false,
                errors: problemData.error.flatten().fieldErrors,
            });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const problemId = problemData.data.id;
        const deleted = yield prisma_1.prisma.solvedProblem.deleteMany({
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
    }
    catch (error) {
        console.error("[markProblemUndone]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.markProblemUndone = markProblemUndone;
const fetchAllTopicsAndNumberOfProblemsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield prisma_1.prisma.topic.findMany({
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
    }
    catch (error) {
        console.error("[fetchAllTopicsAndNumberOfProblemsCount]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.fetchAllTopicsAndNumberOfProblemsCount = fetchAllTopicsAndNumberOfProblemsCount;
