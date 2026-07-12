"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useProblemStore } from "@/store/problemStore";

/* ---------------- Authentic LeetCode-inspired Color Mapping ---------------- */

const getActivityColor = (level: number) => {
    switch (level) {
        case 0:
            return "bg-neutral-100 dark:bg-[#2c2c2c]"; // Empty cell
        case 1:
            return "bg-[#c6e48b] dark:bg-[#0e4429]"; // Low activity
        case 2:
            return "bg-[#7bc96f] dark:bg-[#006d32]"; // Medium activity
        case 3:
            return "bg-[#239a3b] dark:bg-[#26a641]"; // High activity
        case 4:
        default:
            return "bg-[#196127] dark:bg-[#39d353]"; // Max activity
    }
};

/* ---------------- Month Labels ---------------- */

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/* ---------------- Component ---------------- */

const ActivityBar = () => {
    const { solvedProblems } = useProblemStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 53 weeks * 7 days = 371 slots to perfectly fill a standard continuous calendar grid
    const { activityData, activeDays, maxStreak } = useMemo(() => {
        if (!isMounted) {
            return {
                activityData: Array.from({ length: 371 }, () => 0),
                activeDays: 0,
                maxStreak: 0,
            };
        }

        const solvedList = Object.values(solvedProblems);
        const counts: Record<string, number> = {};

        solvedList.forEach((p: any) => {
            if (!p.solvedAt) return;
            const dateStr = p.solvedAt.split("T")[0];
            counts[dateStr] = (counts[dateStr] || 0) + 1;
        });

        // 1. Calculate Activity Grid Data for last 371 days (ending today)
        const gridData: number[] = [];
        const today = new Date();
        for (let i = 370; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const count = counts[dateStr] || 0;
            // Cap at level 4 for coloring
            gridData.push(count > 4 ? 4 : count);
        }

        // 2. Active Days Count
        const activeDaysCount = Object.keys(counts).length;

        // 3. Max Streak Count
        const sortedDates = Object.keys(counts).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        let calculatedMaxStreak = 0;
        if (sortedDates.length > 0) {
            let currentRun = 0;
            let prevDate: Date | null = null;

            for (const dateStr of sortedDates) {
                const currentDate = new Date(dateStr);
                if (prevDate === null) {
                    currentRun = 1;
                } else {
                    const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        currentRun++;
                    } else if (diffDays > 1) {
                        if (currentRun > calculatedMaxStreak) {
                            calculatedMaxStreak = currentRun;
                        }
                        currentRun = 1;
                    }
                }
                prevDate = currentDate;
            }
            calculatedMaxStreak = Math.max(calculatedMaxStreak, currentRun);
        }

        return {
            activityData: gridData,
            activeDays: activeDaysCount,
            maxStreak: calculatedMaxStreak,
        };
    }, [solvedProblems, isMounted]);

    return (
        <div
            className="
                rounded-xl
                border border-neutral-200
                bg-white
                p-5
                shadow-sm
                dark:border-neutral-800/60
                dark:bg-[#1a1a1a]
            "
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800/50">
                <div>
                    <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-200">
                        Submission Activity
                    </h2>
                </div>

                {/* Stats Container */}
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex flex-col items-end md:items-start">
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            Total Active Days
                        </span>
                        <span className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                            {activeDays}
                        </span>
                    </div>
                    
                    <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />
                    
                    <div className="flex flex-col items-end md:items-start">
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            Max Streak
                        </span>
                        <span className="text-lg font-semibold text-[#ffa116]">
                            {maxStreak} {maxStreak === 1 ? "Day" : "Days"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="mt-5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                <div className="min-w-[760px]">
                    {/* Months Line */}
                    <div className="mb-2 flex justify-between pl-10 text-[11px] text-neutral-400 dark:text-neutral-500">
                        {months.map((month, index) => (
                            <span key={index} className="w-full text-left">
                                {month}
                            </span>
                        ))}
                    </div>

                    {/* Main Grid Wrapper */}
                    <div className="flex gap-3">
                        {/* Days Labels */}
                        <div className="flex flex-col justify-between text-[11px] text-neutral-400 dark:text-neutral-500 py-[2px] w-7 select-none">
                            <span>Mon</span>
                            <span>Wed</span>
                            <span>Fri</span>
                        </div>

                        {/* Squares Grid */}
                        <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
                            {activityData.map((level, index) => (
                                <div
                                    key={index}
                                    title={`${level} submissions`}
                                    className={`
                                        h-[11px] w-[11px]
                                        rounded-[2px]
                                        transition-all duration-150
                                        hover:scale-110
                                        hover:ring-1 hover:ring-neutral-400 dark:hover:ring-neutral-500
                                        cursor-pointer
                                        ${getActivityColor(level)}
                                    `}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer containing details and legend */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/40">
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    Recent year activity status
                </span>

                {/* Legend */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                    <span>Less</span>
                    <div className="flex items-center gap-[3px]">
                        <div className="h-[10px] w-[10px] rounded-[2px] bg-neutral-100 dark:bg-[#2c2c2c]" />
                        <div className="h-[10px] w-[10px] rounded-[2px] bg-[#c6e48b] dark:bg-[#0e4429]" />
                        <div className="h-[10px] w-[10px] rounded-[2px] bg-[#7bc96f] dark:bg-[#006d32]" />
                        <div className="h-[10px] w-[10px] rounded-[2px] bg-[#239a3b] dark:bg-[#26a641]" />
                        <div className="h-[10px] w-[10px] rounded-[2px] bg-[#196127] dark:bg-[#39d353]" />
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityBar;