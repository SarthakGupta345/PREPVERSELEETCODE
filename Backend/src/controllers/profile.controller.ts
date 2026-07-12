import { Request, Response, RequestHandler } from "express"
import bcrypt from "bcrypt"
import { ZodError } from "zod"
import { prisma } from "../config/prisma"
import { loginSchema, profileSchema } from "../schemas/profile.schema"
import { axiosInstance } from "../config/axios"
import "dotenv/config"
import { AuthRequest } from "../middlewares/loginMiddleware"


export const signup = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        console.log("called")
        const validData = profileSchema.safeParse(req.body);

        if (!validData.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validData.error.flatten().fieldErrors,
            });
        }

        const { name, email, password } = validData.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
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
        req.user = user

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });

    } catch (error) {
        if (error instanceof ZodError) {
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
};

export const logout = async (req: AuthRequest, res: Response) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        console.error("Logout error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const data = loginSchema.safeParse(req.body)

        if (!data.success) {
            return res.status(400).json({
                success: false,
                errors: data.error.flatten().fieldErrors,
            })
        }

        const { email, password } = data.data

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                passwordHash: true
            }
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = res.cookie("token", {
            id: user.id,
            email: user.email
        }, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        })


        return res.status(200).json({
            success: true,
            message: "Login successful"
        })
    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}

export const ConnectLeetcode = async (req: Request, res: Response) => {
    try {
        const userName = req.body
        if (!userName) {
            return res.status(400).json({
                success: false,
                message: "Username is required"
            })
        }

        const user = await axiosInstance.get(
            `/users/${userName}`
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User found",
            data: user.data
        })

    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }
}


export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        console.log(req.user)
        return res.status(200).json({
            success: true,
            message: "User found",
            data: req.user
        })
    } catch (error) {
        console.error("Get me error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}