"use client";

import React from "react";
import Link from "next/link";
import {
    Search,
    BarChart3,
    Building2,
    Code2,
} from "lucide-react";

import { ModeToggle } from "../themeToggle";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#1a1a1a]">
            <div className=" px-6 flex h-14  items-center justify-between ">

                {/* Left Section */}
                <div className="flex items-center gap-10">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center text-xl font-bold tracking-tight"
                    >
                        <span className="text-[#ffa116]">Prep</span>
                        <span className="text-black dark:text-white">
                            Verse
                        </span>
                    </Link>

                    {/* Nav */}
                    <nav className="hidden items-center gap-6 md:flex">

                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-[#ffa116] dark:text-neutral-300"
                        >
                            <Code2 size={16} />
                            Problems
                        </Link>

                        <Link
                            href="/Company"
                            className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-[#ffa116] dark:text-neutral-300"
                        >
                            <Building2 size={16} />
                            Companies
                        </Link>

                        <Link
                            href="/Progress"
                            className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-[#ffa116] dark:text-neutral-300"
                        >
                            <BarChart3 size={16} />
                            Progress
                        </Link>
                    </nav>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">

                    {/* Search */}
                    <button
                        className="flex w-85 py-2 gap-2 items-center px-3 rounded-lg border border-neutral-300 bg-neutral-100 transition hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    >
                        <Search
                            size={18}
                            className="text-neutral-600 dark:text-neutral-300"
                        />
                        <input type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none placeholder:text-neutral-600 dark:placeholder:text-neutral-300"
                        />
                    </button>

                    {/* Theme Toggle */}
                    <ModeToggle />

                    {/* Login */}
                    <Link
                        href="/signin"
                        className="text-sm font-medium text-neutral-700 transition hover:text-[#ffa116] dark:text-neutral-300"
                    >
                        Sign in
                    </Link>

                    {/* Signup */}
                    <Link
                        href="/signup"
                        className="rounded-lg bg-[#ffa116] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff8f00]"
                    >
                        Login
                    </Link>
                </div>  
            </div>
        </header>
    );
};

export default Header;