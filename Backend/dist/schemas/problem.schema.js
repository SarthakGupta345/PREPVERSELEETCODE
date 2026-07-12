"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.problemQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.problemQuerySchema = zod_1.default.object({
    page: zod_1.default.coerce.number().min(1).default(1),
    limit: zod_1.default.coerce
        .number()
        .min(1)
        .max(100)
        .default(50),
    difficulty: zod_1.default
        .enum(["EASY", "MEDIUM", "HARD", "ALL"])
        .default("ALL"),
    sortBy: zod_1.default
        .enum(["frequency", "acceptanceRate"])
        .default("frequency"),
    order: zod_1.default
        .enum(["asc", "desc"])
        .default("desc"),
});
