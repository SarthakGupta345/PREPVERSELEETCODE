"use client";

import React from "react";
import {
    Building2,
    TrendingUp,
    Trophy,
    ChevronRight,
} from "lucide-react";

const companies = [
    {
        name: "Google",
        problems: 324,
        frequency: "96%",
        difficulty: "Medium",
        color: "from-blue-500/20 to-cyan-500/10",
    },
    {
        name: "Amazon",
        problems: 412,
        frequency: "98%",
        difficulty: "Medium",
        color: "from-orange-500/20 to-yellow-500/10",
    },
    {
        name: "Meta",
        problems: 278,
        frequency: "91%",
        difficulty: "Medium",
        color: "from-blue-600/20 to-indigo-500/10",
    },
    {
        name: "Microsoft",
        problems: 245,
        frequency: "87%",
        difficulty: "Easy",
        color: "from-green-500/20 to-emerald-500/10",
    },
    {
        name: "Apple",
        problems: 198,
        frequency: "82%",
        difficulty: "Hard",
        color: "from-neutral-500/20 to-neutral-700/10",
    },
    {
        name: "Netflix",
        problems: 132,
        frequency: "74%",
        difficulty: "Hard",
        color: "from-red-500/20 to-rose-500/10",
    },
    {
        name: "Adobe",
        problems: 144,
        frequency: "79%",
        difficulty: "Medium",
        color: "from-pink-500/20 to-red-500/10",
    },
    {
        name: "Uber",
        problems: 156,
        frequency: "84%",
        difficulty: "Hard",
        color: "from-purple-500/20 to-violet-500/10",
    },
];

const difficultyColors: Record<string, string> = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-red-500",
};

const CompanyCard = () => {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#141414]">


            {/* Companies Grid */}
            <div className="mx-auto max-w-7xl px-5 py-8">

                <div
                    className="
                        grid grid-cols-1 gap-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4
                    "
                >
                    {companies.map((company, index) => (
                        <button
                            key={index}
                            className="
                                group relative overflow-hidden
                                rounded-2xl

                                border border-neutral-200
                                bg-white
                                p-5

                                text-left

                                shadow-sm
                                transition-all duration-300

                                hover:-translate-y-1
                                hover:border-[#ffa116]
                                hover:shadow-lg

                                dark:border-neutral-800
                                dark:bg-[#1a1a1a]
                            "
                        >
                            {/* Background Gradient */}
                            <div
                                className={`
                                    absolute inset-0 opacity-0
                                    transition-opacity duration-300
                                    group-hover:opacity-100

                                    bg-gradient-to-br
                                    ${company.color}
                                `}
                            />

                            {/* Top */}
                            <div className="relative z-10">

                                {/* Icon */}
                                <div
                                    className="
                                        mb-5 flex h-12 w-12
                                        items-center justify-center

                                        rounded-xl
                                        bg-[#ffa116]/10

                                        text-[#ffa116]

                                        transition-all duration-300

                                        group-hover:scale-110
                                        group-hover:bg-[#ffa116]
                                        group-hover:text-white
                                    "
                                >
                                    <Building2 size={22} />
                                </div>

                                {/* Company Name */}
                                <h2
                                    className="
                                        text-lg font-semibold
                                        text-black

                                        transition-colors duration-200

                                        group-hover:text-[#ffa116]

                                        dark:text-white
                                    "
                                >
                                    {company.name}
                                </h2>

                                {/* Stats */}
                                <div className="mt-5 flex flex-col gap-3">

                                    {/* Problems */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-500">
                                            Total Problems
                                        </span>

                                        <span
                                            className="
                                                text-sm font-semibold
                                                text-black
                                                dark:text-white
                                            "
                                        >
                                            {company.problems}
                                        </span>
                                    </div>

                                    {/* Frequency */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp
                                                size={15}
                                                className="text-[#ffa116]"
                                            />

                                            <span className="text-sm text-neutral-500">
                                                Frequency
                                            </span>
                                        </div>

                                        <span
                                            className="
                                                rounded-md
                                                bg-[#ffa116]/10
                                                px-2 py-1

                                                text-xs font-semibold
                                                text-[#ffa116]
                                            "
                                        >
                                            {company.frequency}
                                        </span>
                                    </div>

                                    {/* Difficulty */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Trophy
                                                size={15}
                                                className="text-[#ffa116]"
                                            />

                                            <span className="text-sm text-neutral-500">
                                                Avg Difficulty
                                            </span>
                                        </div>

                                        <span
                                            className={`
                                                text-sm font-semibold
                                                ${difficultyColors[company.difficulty]}
                                            `}
                                        >
                                            {company.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div
                                className="
                                    absolute bottom-5 right-5

                                    translate-x-2 opacity-0

                                    transition-all duration-300

                                    group-hover:translate-x-0
                                    group-hover:opacity-100
                                "
                            >
                                <ChevronRight
                                    size={18}
                                    className="text-[#ffa116]"
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyCard;