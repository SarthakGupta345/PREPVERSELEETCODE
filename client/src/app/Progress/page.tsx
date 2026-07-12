"use client";

import React, { useState, useEffect, useMemo } from "react";
import ActivityBar from "@/components/Progress/ActivityBar";
import CompanyWiseProgress from "@/components/Progress/comapnyWiseProgress";
import { useProblemStore } from "@/store/problemStore";
const ProgressPage = () => {
    const { solvedProblems } = useProblemStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Compute dynamic stats
    const stats = useMemo(() => {
        if (!isMounted) {
            return {
                totalSolved: 0,
                streak: 0,
                accuracy: 0,
            };
        }

        const solvedList = Object.values(solvedProblems);
        const totalSolved = solvedList.length;

        // 1. Calculate Streak
        const solvedDates = Array.from(
            new Set(
                solvedList.map((p: any) => p.solvedAt?.split("T")[0]).filter(Boolean)
            )
        ).sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime());

        let streak = 0;
        if (solvedDates.length > 0) {
            const todayStr = new Date().toISOString().split("T")[0];
            const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

            // Streak continues if solved today or yesterday
            if (solvedDates[0] === todayStr || solvedDates[0] === yesterdayStr) {
                let currentDate = new Date(solvedDates[0]);
                for (let i = 0; i < solvedDates.length; i++) {
                    const expectedStr = currentDate.toISOString().split("T")[0];
                    if (solvedDates[i] === expectedStr) {
                        streak++;
                        currentDate.setDate(currentDate.getDate() - 1);
                    } else {
                        break;
                    }
                }
            }
        }

        // 2. Calculate Average Accuracy (acceptance rate)
        const avgAccuracy = totalSolved > 0
            ? Math.round(solvedList.reduce((acc: number, p: any) => acc + (p.acceptance || 0), 0) / totalSolved)
            : 0;

        return {
            totalSolved,
            streak,
            accuracy: avgAccuracy,
        };
    }, [solvedProblems, isMounted]);

    return (
        <div
            className="
                min-h-screen
                bg-neutral-50
                dark:bg-[#141414]
            "
        >
            {/* Container */}
            <div className="px-8 py-10">

                {/* Hero / Header Section */}
                <div
                    className="
                        relative overflow-hidden
                        rounded-[24px]
                        border border-neutral-200
                        bg-gradient-to-br
                        from-white
                        via-neutral-50/50
                        to-[#fffaf2]
                        p-8
                        shadow-[0_8px_30px_rgb(0,0,0,0.02)]
                        dark:border-neutral-800
                        dark:from-[#1c1c1c]
                        dark:via-[#1c1c1c]
                        dark:to-[#1f1911]
                        md:p-10
                    "
                >
                    {/* Background Radial Glow */}
                    <div
                        className="
                            absolute -right-10 -top-10
                            h-80 w-80 rounded-full
                            bg-[#ffa116]/10
                            blur-3xl
                            pointer-events-none
                        "
                    />

                    {/* Content Area */}
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        
                        {/* Text Content */}
                        <div className="max-w-3xl">
                            {/* Live Status Badge */}
                            <div
                                className="
                                    mb-4 inline-flex items-center gap-1.5
                                    rounded-full
                                    border border-[#ffa116]/25
                                    bg-[#fff7ed]
                                    px-3 py-1
                                    text-xs font-semibold
                                    tracking-wide
                                    text-[#b37400]
                                    dark:bg-[#2c2214]
                                    dark:text-[#ffb947]
                                    uppercase
                                "
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ffa116] animate-pulse" />
                                Metric Dashboard
                            </div>

                            {/* Main Title */}
                            <h1
                                className="
                                    text-3xl
                                    font-extrabold
                                    tracking-tight
                                    text-neutral-900
                                    dark:text-white
                                    sm:text-4xl
                                    md:text-5xl
                                    md:leading-[1.15]
                                "
                            >
                                Your Placement & <br className="hidden sm:inline" />
                                Company Preparation Hub
                            </h1>

                            {/* Subtitle */}
                            <p
                                className="
                                    mt-4 max-w-xl
                                    text-base
                                    leading-relaxed
                                    text-neutral-500
                                    dark:text-neutral-400
                                "
                            >
                                Evaluate your daily solve metrics, visualize key patterns, and track 
                                completed objectives tailored directly to target company workflows.
                            </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div
                            className="
                                grid grid-cols-1 sm:grid-cols-3 gap-4
                                lg:flex lg:flex-wrap lg:justify-end
                                min-w-[280px] mt-2 lg:mt-0
                            "
                        >
                            {/* Total Solved Card */}
                            <div
                                className="
                                    flex flex-col justify-center
                                    rounded-2xl
                                    border border-neutral-200/80
                                    bg-white/80
                                    px-6 py-4
                                    shadow-sm
                                    backdrop-blur-md
                                    dark:border-neutral-800/80
                                    dark:bg-[#222]/80
                                    min-w-[140px]
                                "
                            >
                                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                                    Total Solved
                                </span>
                                <span className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                                    {stats.totalSolved}
                                </span>
                            </div>

                            {/* Streak Card */}
                            <div
                                className="
                                    flex flex-col justify-center
                                    rounded-2xl
                                    border border-neutral-200/80
                                    bg-white/80
                                    px-6 py-4
                                    shadow-sm
                                    backdrop-blur-md
                                    dark:border-neutral-800/80
                                    dark:bg-[#222]/80
                                    min-w-[140px]
                                "
                            >
                                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                                    Current Streak
                                </span>
                                <span className="mt-1 text-2xl font-bold text-[#ffa116]">
                                    {stats.streak} {stats.streak === 1 ? "Day" : "Days"}
                                </span>
                            </div>

                            {/* Accuracy Card */}
                            <div
                                className="
                                    flex flex-col justify-center
                                    rounded-2xl
                                    border border-neutral-200/80
                                    bg-white/80
                                    px-6 py-4
                                    shadow-sm
                                    backdrop-blur-md
                                    dark:border-neutral-800/80
                                    dark:bg-[#222]/80
                                    min-w-[140px]
                                "
                            >
                                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                                    Avg Accuracy
                                </span>
                                <span className="mt-1 text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                                    {stats.accuracy}%
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Main Activity Progress Grid / Section */}
                <div className="mt-10 grid grid-cols-1 gap-8">
                    {/* Consistency Heatmap */}
                    <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Consistency Heatmap</h2>
                        <ActivityBar />
                    </div>

                    {/* Company Metrics */}
                    <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Target Company Progression</h2>
                        <CompanyWiseProgress />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProgressPage;