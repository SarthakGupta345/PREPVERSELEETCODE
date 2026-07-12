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
exports.addSolvedStatus = exports.problemSelect = void 0;
const prisma_1 = require("../../config/prisma");
exports.problemSelect = {
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
};
const addSolvedStatus = (problems, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || problems.length === 0) {
        return problems.map(problem => (Object.assign(Object.assign({}, problem), { isSolved: false })));
    }
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
    const solvedSet = new Set(solvedProblems.map((sp) => sp.problemId));
    return problems.map(problem => (Object.assign(Object.assign({}, problem), { isSolved: solvedSet.has(problem.id) })));
});
exports.addSolvedStatus = addSolvedStatus;
