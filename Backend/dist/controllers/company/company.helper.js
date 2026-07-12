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
exports.buildOrderBy = exports.getCompany = exports.problemSelect = void 0;
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
            period: true,
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
const getCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let company = yield prisma_1.prisma.company.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
        },
    });
    if (company)
        return company;
    company = yield prisma_1.prisma.company.findUnique({
        where: { slug: id.toLowerCase() },
        select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
        },
    });
    if (company)
        return company;
    return prisma_1.prisma.company.findUnique({
        where: { name: id },
        select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
        },
    });
});
exports.getCompany = getCompany;
const buildOrderBy = (sortBy, order) => {
    switch (sortBy) {
        case "difficulty":
            return { difficulty: order };
        case "acceptanceRate":
            return { acceptanceRate: order };
        default:
            return { frequency: order };
    }
};
exports.buildOrderBy = buildOrderBy;
