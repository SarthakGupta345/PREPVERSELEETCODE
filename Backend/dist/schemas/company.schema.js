"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyProblemQuerySchema = exports.companyIdSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.companyIdSchema = zod_1.default.object({
    id: zod_1.default.string().min(1, "Company ID is required"),
});
exports.companyProblemQuerySchema = zod_1.default.object({
    difficulty: zod_1.default
        .enum(["EASY", "MEDIUM", "HARD", "ALL"])
        .default("ALL"),
    sortBy: zod_1.default
        .enum(["frequency", "difficulty", "acceptanceRate"])
        .default("frequency"),
    order: zod_1.default
        .enum(["asc", "desc"])
        .default("desc"),
});
