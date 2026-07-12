"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companySchema = exports.topicSchema = exports.usernameSchema = exports.idSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.idSchema = zod_1.default.object({
    id: zod_1.default.string(),
});
exports.usernameSchema = zod_1.default.object({
    username: zod_1.default.string(),
});
exports.topicSchema = zod_1.default.object({
    topic: zod_1.default.string(),
});
exports.companySchema = zod_1.default.object({
    company: zod_1.default.string(),
});
