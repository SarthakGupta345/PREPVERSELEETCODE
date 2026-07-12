"use client";

import Link from "next/link";
import z from "zod"
import {
    BadgeAlert,
    FileWarning,
    LucideBatteryWarning,
    Mail,
    Moon,
} from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { useState } from "react";

const LoginPage = () => {
    const { mutateAsync: login, isPending } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<{
        type: string;
        value: string;
    }>({
        type: "",
        value: "",
    });
    const [success, setSuccess] = useState<string | null>(null);

    const loginSchema = z.object({
        email: z
            .string()
            .email("Invalid email address"),
        password: z
            .string()
            .min(
                6,
                "Password must be at least 6 characters long"
            ),
    });

    const handleLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (isPending) return;

        try {
            const validation = loginSchema.safeParse({
                email,
                password,
            });

            if (!validation.success) {
                const firstError = validation.error.issues[0];

                setError({
                    type: firstError.path[0]?.toString() || "",
                    value: firstError.message,
                });

                return;
            }

            setError({
                type: "",
                value: "",
            });
            setSuccess(null);

            const data = await login({
                email,
                password,
            });

            if (data?.error) {
                setError(data.error);
                return;
            }

            setSuccess(
                data?.message || "Login successful"
            );
            alert("Login successful");

            // redirect here if needed
            // router.push("/dashboard");

        } catch (err: any) {
            setError({
                type: "General",
                value: err || "Something Went Wrong"
            });
        }
    };
    return (
        <div
            className="
                flex min-h-screen items-center justify-center
                bg-neutral-50 px-4
                dark:bg-[#141414]
            "
        >
            <div
                className="
                    w-full max-w-md
                    rounded-2xl
                    border border-neutral-200
                    bg-white
                    p-8
                    shadow-sm

                    dark:border-neutral-800
                    dark:bg-[#1a1a1a]
                "
            >
                {/* Logo */}
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="text-3xl font-bold tracking-tight"
                    >
                        <span className="text-[#ffa116]">
                            Prep
                        </span>

                        <span className="text-black dark:text-white">
                            Verse
                        </span>
                    </Link>

                    <p className="mt-3 text-sm text-neutral-500">
                        Sign in to continue your interview prep
                    </p>
                </div>

                {/* Social Login */}
                <div className="flex flex-col gap-3">

                    {/* Google */}
                    <button
                        className="
                            flex h-11 items-center justify-center gap-3
                            rounded-xl
                            border border-neutral-300
                            bg-white

                            text-sm font-medium
                            text-neutral-700

                            transition-all duration-200

                            hover:border-[#ffa116]
                            hover:bg-[#fff7ed]

                            dark:border-neutral-700
                            dark:bg-[#222]
                            dark:text-neutral-200
                            dark:hover:bg-[#2a241c]
                        "
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="google"
                            className="h-5 w-5"
                        />

                        Continue with Google
                    </button>

                    {/* GitHub */}
                    <button
                        className="
                            flex h-11 items-center justify-center gap-3
                            rounded-xl
                            border border-neutral-300
                            bg-white

                            text-sm font-medium
                            text-neutral-700

                            transition-all duration-200

                            hover:border-[#ffa116]
                            hover:bg-[#fff7ed]

                            dark:border-neutral-700
                            dark:bg-[#222]
                            dark:text-neutral-200
                            dark:hover:bg-[#2a241c]
                        "
                    >
                        <Moon size={18} />

                        Continue with GitHub
                    </button>
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />

                    <span className="text-xs text-neutral-500">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                </div>

                {/* Form */}
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-4"
                >

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="
                                text-sm font-medium
                                text-neutral-700
                                dark:text-neutral-300
                            "
                        >
                            Email
                        </label>

                        <div
                            className="
                                flex h-11 items-center gap-3
                                rounded-xl
                                border border-neutral-300
                                bg-neutral-50
                                px-3

                                transition-all duration-200

                                focus-within:border-[#ffa116]
                                focus-within:bg-white

                                dark:border-neutral-700
                                dark:bg-[#222]
                            "
                        >
                            <Mail
                                size={17}
                                className="text-neutral-500"
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                className="
                                    w-full bg-transparent
                                    text-sm outline-none
                                    placeholder:text-neutral-500
                                    dark:text-white"
                            />
                        </div>
                        {
                            error.type == "email" && <div className="flex  ml-1 gap-1">
                                <BadgeAlert className="size-3 text-red-400 mt-px" />
                                <p className="text-red-500 text-xs">{error.value || "Email info was incorrect"}</p>

                            </div>
                        }
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="
                                text-sm font-medium
                                text-neutral-700
                                dark:text-neutral-300
                            "
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            className="
                                    h-11 rounded-xl
                                    border border-neutral-300
                                    bg-neutral-50   
                                    px-4
                                    text-sm outline-none
                                    transition-all duration-200
                                    focus:border-[#ffa116]
                                    focus:bg-white
                                    dark:border-neutral-700
                                    dark:bg-[#222]
                                    dark:text-white
                            "
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="
                                text-sm font-medium
                                text-[#ffa116]
                                transition hover:opacity-80
                            "
                        >
                            Forgot password?
                        </button>
                    </div>
                    {
                        error.type == "password" && <div className="flex -mt-10  ml-1 gap-1">
                            <BadgeAlert className="size-3 text-red-400 mt-px" />
                            <p className="text-red-500 text-xs">{error.value || "password info was incorrect"}</p>
                        </div>
                    }


                    {/* Sign In */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="
                        mt-2 h-11
                        rounded-xl
                        bg-[#ffa116]
                        text-sm font-semibold
                        text-white
                        transition-all duration-200
                        hover:bg-[#ff9500]
                        hover:shadow-md
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                    >
                        {isPending ? "Signing In..." : "Sign In"}
                    </button>
                    {
                        error.type == "General" && <div className="flex  ml-1 gap-1">
                            <BadgeAlert className="size-3 text-red-400 mt-px" />
                            <p className="text-red-500 text-xs">{error.value || "Something Went Wrong"}</p>
                        </div>
                    }
                </form>

                {/* Bottom */}
                <p
                    className="
                        mt-6 text-center
                        text-sm text-neutral-500
                    "
                >
                    Don&apos;t have an account?{" "}

                    <Link
                        href="/signup"
                        className="
                            font-medium
                            text-[#ffa116]
                            hover:underline
                        "
                    >
                        Sign up
                    </Link>


                </p>
            </div>
        </div>
    );
};

export default LoginPage;