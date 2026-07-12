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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.ConnectLeetcode = exports.login = exports.logout = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const prisma_1 = require("../config/prisma");
const profile_schema_1 = require("../schemas/profile.schema");
const axios_1 = require("../config/axios");
require("dotenv/config");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("called");
        const validData = profile_schema_1.profileSchema.safeParse(req.body);
        if (!validData.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validData.error.flatten().fieldErrors,
            });
        }
        const { name, email, password } = validData.data;
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma_1.prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Failed to create user",
            });
        }
        req.user = user;
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues,
            });
        }
        if (error instanceof Error) {
            console.error("Signup error:", error.message);
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.signup = signup;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.logout = logout;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = profile_schema_1.loginSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({
                success: false,
                errors: data.error.flatten().fieldErrors,
            });
        }
        const { email, password } = data.data;
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                passwordHash: true
            }
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = res.cookie("token", {
            id: user.id,
            email: user.email
        }, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        return res.status(200).json({
            success: true,
            message: "Login successful"
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.login = login;
const ConnectLeetcode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userName = req.body;
        if (!userName) {
            return res.status(400).json({
                success: false,
                message: "Username is required"
            });
        }
        const user = yield axios_1.axiosInstance.get(`/users/${userName}`);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User found",
            data: user.data
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.ConnectLeetcode = ConnectLeetcode;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        return res.status(200).json({
            success: true,
            message: "User found",
            data: req.user
        });
    }
    catch (error) {
        console.error("Get me error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.getMe = getMe;
