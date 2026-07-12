"use client";

import React, { useMemo, useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useProblemStore } from "@/store/problemStore";
import globalProblems from "@/constants/data/globalProblems.json";
import type { GlobalProblem } from "@/constants/problemData";

const problems = globalProblems as GlobalProblem[];

/* ---------------- Brand-Specific SVG Icons ---------------- */

const BrandIcon = ({ name }: { name: string }) => {
    const icons: Record<string, React.ReactNode> = {
        Google: (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
        ),
        Amazon: (
            <svg className="h-6 w-6 mt-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.36 13.92c-.52.36-1.12.56-1.74.56-.83 0-1.53-.41-1.84-1.05-.69.64-1.54 1.05-2.52 1.05-1.58 0-2.68-1.07-2.68-2.57 0-2.3 2.11-2.95 4.98-2.95v-.14c0-.62-.25-1.13-1.21-1.13-.76 0-1.54.26-2.14.63l-.44-.92c.79-.53 1.83-.84 2.94-.84 1.88 0 2.85.95 2.85 2.76v2.8c0 .87.31 1.17.65 1.17.21 0 .43-.07.61-.19l-.1.62zm-3.56-3.21c-1.63 0-2.73.31-2.73 1.44 0 .76.54 1.18 1.28 1.18.91 0 1.45-.53 1.45-1.39v-1.23zM4.31 17.5c3.27 2.37 7.79 3.1 11.75 1.95.4-.12.8-.27 1.16-.47.33-.18.42-.45.16-.69-.22-.2-.55-.16-.84-.04-3.41 1.34-7.58.91-10.66-1.14-.3-.22-.68-.1-.85.19-.17.29-.05.59.28.2z" />
            </svg>
        ),
        Meta: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0668E1">
                <path d="M15.542 4.425a6.002 6.002 0 0 0-8.418.665l-.656.787a7.797 7.797 0 0 1 1.764 2.85c.677-1.18 1.815-2.057 3.141-2.455a4.341 4.341 0 0 1 5.372 1.947c1.173 2.191.733 4.939-1.057 6.574l-.946.865a7.801 7.801 0 0 1-5.32 1.936 7.796 7.796 0 0 1-5.32-1.936l-.947-.865c-1.79-1.635-2.23-4.383-1.057-6.574a4.341 4.341 0 0 1 5.372-1.947c1.326.398 2.464 1.275 3.141 2.455a7.797 7.797 0 0 1 1.764-2.85l-.656-.787a6.002 6.002 0 0 0-8.418-.665C1.196 6.452.348 9.973 1.583 13.084c1.11 2.795 3.738 4.717 6.745 4.991h1.344c3.007-.274 5.635-2.196 6.745-4.991 1.235-3.111.387-6.632-2.875-8.659z" />
            </svg>
        ),
        Microsoft: (
            <svg className="h-5 w-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M0 0h11v11H0z" />
                <path fill="#81bc06" d="M12 0h11v11H12z" />
                <path fill="#05a6f0" d="M0 12h11v11H0z" />
                <path fill="#ffba08" d="M12 12h11v11H12z" />
            </svg>
        ),
        Apple: (
            <svg className="h-5 w-5 mb-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94 1.07.08 2.16-.52 2.82-1.33z" />
            </svg>
        ),
        Netflix: (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#E50914">
                <path d="M4 21.096V2.904h3.817l5.127 10.428V2.904h3.82v18.192h-3.41L8.232 10.322v10.774H4z" />
            </svg>
        ),
        Uber: (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.35 14.13l-1.42 1.42L12 14.62l-2.93 2.93-1.42-1.42 2.93-2.93-2.93-2.93 1.42-1.42L12 11.78l2.93-2.93 1.42 1.42-2.93 2.93 2.93 2.93z" />
            </svg>
        ),
        Adobe: (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M13.966 2H22v19.343L13.966 2zm-3.932 0H2v19.343L10.034 2zM12 8.766l4.475 10.662h-3.088l-1.396-3.513H9.313L12 8.766z" />
            </svg>
        ),
    };

    return icons[name] || null;
};

/* ---------------- Dynamic Configurations ---------------- */

const targetCompaniesConfig = [
    {
        company: "Google",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
    },
    {
        company: "Amazon",
        color: "from-orange-500 to-amber-500",
        bgColor: "bg-orange-500/10",
    },
    {
        company: "Meta",
        color: "from-blue-600 to-indigo-500",
        bgColor: "bg-blue-600/10",
    },
    {
        company: "Microsoft",
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-500/10",
    },
    {
        company: "Apple",
        color: "from-neutral-700 to-neutral-900 dark:from-neutral-300 dark:to-neutral-100",
        bgColor: "bg-neutral-500/10",
    },
    {
        company: "Netflix",
        color: "from-red-600 to-rose-600",
        bgColor: "bg-red-600/10",
    },
    {
        company: "Uber",
        color: "from-gray-800 to-black dark:from-gray-200 dark:to-white",
        bgColor: "bg-gray-500/10",
    },
    {
        company: "Adobe",
        color: "from-red-500 to-pink-600",
        bgColor: "bg-red-500/10",
    },
];

/* ---------------- Component ---------------- */

const CompanyWiseProgress = () => {
    const { solvedProblems } = useProblemStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Calculate progression dynamically
    const companyProgress = useMemo(() => {
        return targetCompaniesConfig.map((item) => {
            if (!isMounted) {
                return {
                    ...item,
                    solved: 0,
                    total: 10,
                };
            }

            const compLower = item.company.toLowerCase();

            // Total problems asked by this company in globalProblems.json
            const total = problems.filter((p) =>
                p.companies.some((c) => c.toLowerCase() === compLower)
            ).length;

            // Solved problems asked by this company
            const solved = problems.filter((p) => {
                const key = p.title.toLowerCase().trim();
                const isSolved = !!solvedProblems[key];
                const isCompanyProblem = p.companies.some((c) => c.toLowerCase() === compLower);
                return isSolved && isCompanyProblem;
            }).length;

            return {
                ...item,
                solved,
                total: total || 1, // Fallback to 1 to avoid division by zero
            };
        });
    }, [solvedProblems, isMounted]);

    return (
        <div
            className="
                rounded-3xl
                border border-neutral-200/80
                bg-white/80
                backdrop-blur-md
                p-6
                shadow-sm
                dark:border-neutral-800/80
                dark:bg-[#121212]/90
            "
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2
                        className="
                            text-xl font-bold tracking-tight
                            text-neutral-900
                            dark:text-neutral-50
                        "
                    >
                        Company-wise Progress
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Track interview preparation checkpoints
                    </p>
                </div>

                {/* Count Label */}
                <div
                    className="
                        rounded-xl
                        bg-amber-500/10
                        px-3 py-1.5
                        text-xs font-semibold tracking-wide
                        text-amber-600 dark:text-amber-400
                    "
                >
                    {companyProgress.length} Target Hubs
                </div>
            </div>

            {/* Grid Matrix */}
            <div
                className="
                    mt-8
                    grid grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                "
            >
                {companyProgress.map((item, index) => {
                    const percentage = Math.round((item.solved / item.total) * 100);

                    return (
                        <div
                            key={index}
                            className="
                                group
                                relative overflow-hidden
                                rounded-2xl
                                border border-neutral-100
                                bg-neutral-50/50
                                p-5
                                transition-all duration-300 ease-out
                                hover:-translate-y-1
                                hover:border-neutral-200
                                hover:bg-white
                                hover:shadow-md
                                dark:border-neutral-900
                                dark:bg-[#1a1a1a]/40
                                dark:hover:border-neutral-800
                                dark:hover:bg-[#1a1a1a]
                            "
                        >
                            {/* Context Action Area */}
                            <div className="relative z-10 flex flex-col justify-between h-full">

                                {/* Upper Details */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        {/* Brand Dynamic Icon Frame */}
                                        <div
                                            className={`
                                                flex h-11 w-11
                                                items-center justify-center
                                                rounded-xl
                                                ${item.bgColor}
                                                text-neutral-800 dark:text-neutral-200
                                                transition-transform duration-300 group-hover:scale-105
                                            `}
                                        >
                                            <BrandIcon name={item.company} />
                                        </div>

                                        <div>
                                            <h3
                                                className="
                                                    text-sm font-semibold
                                                    text-neutral-800
                                                    dark:text-neutral-200
                                                "
                                            >
                                                {item.company}
                                            </h3>
                                            <div className="mt-0.5 flex items-center gap-1">
                                                <CheckCircle2
                                                    size={12}
                                                    className="text-neutral-400 dark:text-neutral-500"
                                                />
                                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                    {item.solved} Clear
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Percentage Chip */}
                                    <div
                                        className="
                                            text-sm font-bold tracking-tight
                                            text-neutral-700 dark:text-neutral-300
                                        "
                                    >
                                        {percentage}%
                                    </div>
                                </div>

                                {/* Lower Progress Bar Architecture */}
                                <div className="mt-5">
                                    <div className="mb-1.5 flex items-center justify-between text-[11px]">
                                        <span className="font-medium text-neutral-400 dark:text-neutral-500">
                                            Metrics
                                        </span>
                                        <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                                            {item.solved} / {item.total}
                                        </span>
                                    </div>

                                    {/* Custom Container Bar */}
                                    <div
                                        className="
                                            h-1.5 w-full overflow-hidden
                                            rounded-full
                                            bg-neutral-100
                                            dark:bg-neutral-800
                                        "
                                    >
                                        <div
                                            style={{ width: `${percentage}%` }}
                                            className={`
                                                h-full rounded-full
                                                bg-gradient-to-r ${item.color}
                                                transition-all duration-700 ease-in-out
                                            `}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CompanyWiseProgress;