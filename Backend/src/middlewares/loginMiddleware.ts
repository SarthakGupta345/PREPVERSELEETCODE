import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

import { Request } from "express";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}
interface JWTPayload {
    id: string;
    email: string;
}

interface JWTPayload {
    id: string;
}

export const loginMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.cookie) {
            const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
                const [key, value] = cookie.split("=");
                if (key) acc[key.trim()] = value ? value.trim() : "";
                return acc;
            }, {} as Record<string, string>);
            token = cookies.token;
        }

        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(" ");
            if (parts.length === 2 && parts[0] === "Bearer") {
                token = parts[1];
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const secret = process.env.JWT_SECRET_KEY;

        if (!secret) {
            throw new Error("JWT secret not defined");
        }

        const decoded = jwt.verify(token, secret) as JWTPayload;

        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        console.log(user);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

export const optionalLoginMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.cookie) {
            const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
                const [key, value] = cookie.split("=");
                if (key) acc[key.trim()] = value ? value.trim() : "";
                return acc;
            }, {} as Record<string, string>);
            token = cookies.token;
        }

        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(" ");
            if (parts.length === 2 && parts[0] === "Bearer") {
                token = parts[1];
            }
        }

        if (!token) {
            return next();
        }

        const secret = process.env.JWT_SECRET_KEY;

        if (!secret) {
            return next();
        }

        const decoded = jwt.verify(token, secret) as JWTPayload;

        if (!decoded?.id) {
            return next();
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
            },
        });

        if (user) {
            req.user = user;
        }
        next();
    } catch (error) {
        next();
    }
};