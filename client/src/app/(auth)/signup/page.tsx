"use client";

import React from "react";
import Link from "next/link";
import {
    Moon,
    Mail,
    User,
    Lock,
} from "lucide-react";

const SignuPage = () => {
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
                        Create your account and start
                        mastering coding interviews
                    </p>
                </div>

                {/* Social Signup */}
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
                <form className="flex flex-col gap-4">

                    {/* Username */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="
                                text-sm font-medium
                                text-neutral-700
                                dark:text-neutral-300
                            "
                        >
                            Username
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
                            <User
                                size={17}
                                className="text-neutral-500"
                            />

                            <input
                                type="text"
                                placeholder="Choose a username"
                                className="
                                    w-full bg-transparent
                                    text-sm outline-none
                                    placeholder:text-neutral-500
                                    dark:text-white
                                "
                            />
                        </div>
                    </div>

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
                                placeholder="Enter your email"
                                className="
                                    w-full bg-transparent
                                    text-sm outline-none
                                    placeholder:text-neutral-500
                                    dark:text-white
                                "
                            />
                        </div>
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
                            <Lock
                                size={17}
                                className="text-neutral-500"
                            />

                            <input
                                type="password"
                                placeholder="Create a password"
                                className="
                                    w-full bg-transparent
                                    text-sm outline-none
                                    placeholder:text-neutral-500
                                    dark:text-white
                                "
                            />
                        </div>
                    </div>

                    {/* Terms */}
                    <label className="mt-1 flex items-start gap-2">
                        <input
                            type="checkbox"
                            className="mt-1"
                        />

                        <span className="text-sm text-neutral-500">
                            I agree to the{" "}
                            <span className="text-[#ffa116]">
                                Terms of Service
                            </span>{" "}
                            and{" "}
                            <span className="text-[#ffa116]">
                                Privacy Policy
                            </span>
                        </span>
                    </label>

                    {/* Signup */}
                    <button
                        type="submit"
                        className="
                            mt-2 h-11
                            rounded-xl
                            bg-[#ffa116]

                            text-sm font-semibold
                            text-white

                            transition-all duration-200

                            hover:bg-[#ff9500]
                            hover:shadow-md
                        "
                    >
                        Create Account
                    </button>
                </form>

                {/* Bottom */}
                <p
                    className="
                        mt-6 text-center
                        text-sm text-neutral-500
                    "
                >
                    Already have an account?{" "}

                    <Link
                        href="/signin"
                        className="
                            font-medium
                            text-[#ffa116]
                            hover:underline
                        "
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignuPage;