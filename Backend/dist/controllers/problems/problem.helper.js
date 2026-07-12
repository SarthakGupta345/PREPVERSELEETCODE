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
exports.addSolvedStatus = exports.mapProblemData = exports.problemSelect = void 0;
const prisma_1 = require("../../config/prisma");
exports.problemSelect = {
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
};
const mapProblemData = (problems) => {
    return problems.map((p) => {
        const companyMap = new Map();
        if (p.companyProblems) {
            p.companyProblems.forEach((cp) => {
                if (cp.company) {
                    companyMap.set(cp.company.name, cp.company);
                }
            });
        }
        const companies = Array.from(companyMap.values());
        const maxFrequency = p.companyProblems && p.companyProblems.length > 0
            ? Math.max(...p.companyProblems.map((cp) => cp.frequency))
            : 0.0;
        const { companyProblems } = p, rest = __rest(p, ["companyProblems"]);
        return Object.assign(Object.assign({}, rest), { companies, frequency: maxFrequency });
    });
};
exports.mapProblemData = mapProblemData;
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
