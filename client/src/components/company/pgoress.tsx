"use client";

import React from "react";
import {
    CheckCircle2,
    Flame,
    Trophy,
} from "lucide-react";

export interface ProgressStats {
    easySolved: number;
    easyTotal: number;
    mediumSolved: number;
    mediumTotal: number;
    hardSolved: number;
    hardTotal: number;
}

interface ProgressProps {
    stats?: ProgressStats;
}

const Progress = ({ stats }: ProgressProps) => {
    const progressData = [
        {
            level: "Easy",
            solved: stats?.easySolved ?? 0,
            total: stats?.easyTotal ?? 0,
            color: "bg-green-500",
            text: "text-green-500",
            icon: <CheckCircle2 size={18} />,
        },
        {
            level: "Medium",
            solved: stats?.mediumSolved ?? 0,
            total: stats?.mediumTotal ?? 0,
            color: "bg-yellow-500",
            text: "text-yellow-500",
            icon: <Flame size={18} />,
        },
        {
            level: "Hard",
            solved: stats?.hardSolved ?? 0,
            total: stats?.hardTotal ?? 0,
            color: "bg-red-500",
            text: "text-red-500",
            icon: <Trophy size={18} />,
        },
    ];

    return (
        <div
            className="
                rounded-xl
                border border-neutral-200
                bg-white
                p-5
                shadow-sm

                dark:border-neutral-800
                dark:bg-[#1a1a1a]
            "
        >
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-lg  -mt-1 font-semibold text-black dark:text-white">
                    Your Progress
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                    {(stats?.easySolved ?? 0) + (stats?.mediumSolved ?? 0) + (stats?.hardSolved ?? 0)} /{" "}
                    {(stats?.easyTotal ?? 0) + (stats?.mediumTotal ?? 0) + (stats?.hardTotal ?? 0)} solved
                </p>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-5">
                {progressData.map((item, index) => {
                    const percentage =
                        item.total > 0
                            ? (item.solved / item.total) * 100
                            : 0;

                    return (
                        <div key={index}>
                            {/* Top */}
                            <div className="mb-2 flex items-center justify-between">

                                {/* Left */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`
                                            flex h-9 w-9 items-center
                                            justify-center rounded-lg

                                            bg-neutral-100
                                            ${item.text}

                                            dark:bg-[#222]
                                        `}
                                    >
                                        {item.icon}
                                    </div>

                                    <div>
                                        <h3
                                            className={`
                                                text-sm font-semibold
                                                ${item.text}
                                            `}
                                        >
                                            {item.level}
                                        </h3>

                                        <p className="text-xs text-neutral-500">
                                            {item.solved} / {item.total} solved
                                        </p>
                                    </div>
                                </div>

                                {/* Right */}
                                <span
                                    className="
                                        text-sm font-semibold
                                        text-neutral-700
                                        dark:text-neutral-300
                                    "
                                >
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div
                                className="
                                    h-2 overflow-hidden
                                    rounded-full
                                    bg-neutral-200

                                    dark:bg-neutral-800
                                "
                            >
                                <div
                                    style={{
                                        width: `${percentage}%`,
                                    }}
                                    className={`
                                        h-full rounded-full
                                        transition-all duration-700
                                        ${item.color}
                                    `}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Progress;