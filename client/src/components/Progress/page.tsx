"use client";

import React from "react";
import {
    CheckCircle2,
    Flame,
    Trophy,
    CalendarDays,
    Target,
    TrendingUp,
    Clock3,
} from "lucide-react";

const difficultyStats = [
    {
        title: "Easy",
        solved: 142,
        total: 320,
        color: "text-green-500",
        bg: "bg-green-500",
        light: "bg-green-500/10",
        icon: <CheckCircle2 size={18} />,
    },
    {
        title: "Medium",
        solved: 89,
        total: 410,
        color: "text-yellow-500",
        bg: "bg-yellow-500",
        light: "bg-yellow-500/10",
        icon: <Flame size={18} />,
    },
    {
        title: "Hard",
        solved: 21,
        total: 180,
        color: "text-red-500",
        bg: "bg-red-500",
        light: "bg-red-500/10",
        icon: <Trophy size={18} />,
    },
];

const recentActivity = [
    {
        name: "Two Sum",
        time: "2 hours ago",
    },
    {
        name: "Binary Search",
        time: "5 hours ago",
    },
    {
        name: "LRU Cache",
        time: "Yesterday",
    },
    {
        name: "Merge Intervals",
        time: "2 days ago",
    },
];

const ProgressPage = () => {
    return (
        <div
            className="
                min-h-screen
                bg-neutral-50

                dark:bg-[#141414]
            "
        >
            {/* Container */}
            <div className="mx-auto max-w-7xl px-5 py-8">

                {/* Hero */}
                <div
                    className="
                        relative overflow-hidden

                        rounded-[32px]
                        border border-neutral-200

                        bg-gradient-to-br
                        from-white
                        via-white
                        to-[#fff7ed]

                        p-8

                        shadow-[0_10px_40px_rgba(0,0,0,0.04)]

                        dark:border-neutral-800
                        dark:from-[#1a1a1a]
                        dark:via-[#1a1a1a]
                        dark:to-[#211b12]
                    "
                >
                    {/* Glow */}
                    <div
                        className="
                            absolute -right-20 -top-20
                            h-72 w-72 rounded-full

                            bg-[#ffa116]/15
                            blur-3xl
                        "
                    />

                    <div className="relative z-10">

                        {/* Badge */}
                        <div
                            className="
                                mb-5 inline-flex items-center gap-2

                                rounded-full
                                border border-[#ffa116]/20

                                bg-[#fff7ed]

                                px-4 py-2

                                text-sm font-medium
                                text-[#c88400]

                                dark:bg-[#2a241c]
                            "
                        >
                            📈 Track Your Coding Journey
                        </div>

                        {/* Heading */}
                        <h1
                            className="
                                max-w-4xl

                                text-[42px]
                                font-black

                                leading-[1.08]
                                tracking-[-0.03em]

                                text-neutral-900

                                dark:text-white

                                md:text-[58px]
                            "
                        >
                            Monitor Your Interview
                            Preparation Progress
                        </h1>

                        {/* Description */}
                        <p
                            className="
                                mt-6 max-w-2xl

                                text-[17px]
                                leading-8

                                text-neutral-500

                                dark:text-neutral-400
                            "
                        >
                            Track solved questions, analyze
                            your strengths across difficulty
                            levels, and stay consistent in
                            your coding interview preparation.
                        </p>

                        {/* Quick Stats */}
                        <div
                            className="
                                mt-10 flex flex-wrap
                                items-center gap-4
                            "
                        >
                            {/* Total Solved */}
                            <div
                                className="
                                    rounded-[22px]
                                    border border-neutral-200

                                    bg-white/70

                                    px-6 py-5

                                    backdrop-blur-sm

                                    dark:border-neutral-800
                                    dark:bg-[#222]/70
                                "
                            >
                                <p
                                    className="
                                        text-sm
                                        text-neutral-500
                                    "
                                >
                                    Total Solved
                                </p>

                                <h3
                                    className="
                                        mt-1 text-3xl
                                        font-bold

                                        text-neutral-900

                                        dark:text-white
                                    "
                                >
                                    252
                                </h3>
                            </div>

                            {/* Streak */}
                            <div
                                className="
                                    rounded-[22px]
                                    border border-neutral-200

                                    bg-white/70

                                    px-6 py-5

                                    backdrop-blur-sm

                                    dark:border-neutral-800
                                    dark:bg-[#222]/70
                                "
                            >
                                <p
                                    className="
                                        text-sm
                                        text-neutral-500
                                    "
                                >
                                    Current Streak
                                </p>

                                <h3
                                    className="
                                        mt-1 text-3xl
                                        font-bold

                                        text-[#ffa116]
                                    "
                                >
                                    16 Days
                                </h3>
                            </div>

                            {/* Accuracy */}
                            <div
                                className="
                                    rounded-[22px]
                                    border border-neutral-200

                                    bg-white/70

                                    px-6 py-5

                                    backdrop-blur-sm

                                    dark:border-neutral-800
                                    dark:bg-[#222]/70
                                "
                            >
                                <p
                                    className="
                                        text-sm
                                        text-neutral-500
                                    "
                                >
                                    Accuracy
                                </p>

                                <h3
                                    className="
                                        mt-1 text-3xl
                                        font-bold

                                        text-green-500
                                    "
                                >
                                    78%
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div
                    className="
                        mt-8 grid grid-cols-1
                        gap-6

                        lg:grid-cols-12
                    "
                >
                    {/* Left */}
                    <div className="space-y-6 lg:col-span-8">

                        {/* Progress Overview */}
                        <div
                            className="
                                rounded-3xl
                                border border-neutral-200
                                bg-white

                                p-6

                                shadow-sm

                                dark:border-neutral-800
                                dark:bg-[#1a1a1a]
                            "
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2
                                        className="
                                            text-2xl font-bold
                                            text-black

                                            dark:text-white
                                        "
                                    >
                                        Difficulty Progress
                                    </h2>

                                    <p className="mt-1 text-sm text-neutral-500">
                                        Breakdown of solved
                                        problems
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex h-12 w-12
                                        items-center justify-center

                                        rounded-2xl

                                        bg-[#ffa116]/10

                                        text-[#ffa116]
                                    "
                                >
                                    <TrendingUp size={22} />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-8 space-y-6">
                                {difficultyStats.map(
                                    (item, index) => {
                                        const percentage =
                                            (
                                                (item.solved /
                                                    item.total) *
                                                100
                                            ).toFixed(0);

                                        return (
                                            <div
                                                key={index}
                                            >
                                                {/* Top */}
                                                <div
                                                    className="
                                                        mb-3 flex
                                                        items-center
                                                        justify-between
                                                    "
                                                >
                                                    <div className="flex items-center gap-3">

                                                        {/* Icon */}
                                                        <div
                                                            className={`
                                                                flex h-11 w-11
                                                                items-center
                                                                justify-center

                                                                rounded-xl

                                                                ${item.light}
                                                                ${item.color}
                                                            `}
                                                        >
                                                            {
                                                                item.icon
                                                            }
                                                        </div>

                                                        {/* Info */}
                                                        <div>
                                                            <h3
                                                                className={`
                                                                    text-sm
                                                                    font-semibold

                                                                    ${item.color}
                                                                `}
                                                            >
                                                                {
                                                                    item.title
                                                                }
                                                            </h3>

                                                            <p className="text-xs text-neutral-500">
                                                                {
                                                                    item.solved
                                                                }{" "}
                                                                /
                                                                {
                                                                    item.total
                                                                }{" "}
                                                                solved
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Percentage */}
                                                    <span
                                                        className="
                                                            text-sm
                                                            font-semibold

                                                            text-neutral-700

                                                            dark:text-neutral-300
                                                        "
                                                    >
                                                        {
                                                            percentage
                                                        }
                                                        %
                                                    </span>
                                                </div>

                                                {/* Progress */}
                                                <div
                                                    className="
                                                        h-3 overflow-hidden
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
                                                            h-full
                                                            rounded-full

                                                            ${item.bg}
                                                        `}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {/* Weekly Heatmap Placeholder */}
                        <div
                            className="
                                rounded-3xl
                                border border-neutral-200
                                bg-white

                                p-6

                                shadow-sm

                                dark:border-neutral-800
                                dark:bg-[#1a1a1a]
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        flex h-11 w-11
                                        items-center justify-center

                                        rounded-xl

                                        bg-blue-500/10

                                        text-blue-500
                                    "
                                >
                                    <CalendarDays size={20} />
                                </div>

                                <div>
                                    <h2
                                        className="
                                            text-xl font-bold
                                            text-black

                                            dark:text-white
                                        "
                                    >
                                        Activity Heatmap
                                    </h2>

                                    <p className="mt-1 text-sm text-neutral-500">
                                        Your coding consistency
                                    </p>
                                </div>
                            </div>

                            {/* Heatmap Mock */}
                            <div
                                className="
                                    mt-8 grid grid-cols-7
                                    gap-2
                                "
                            >
                                {Array.from({
                                    length: 49,
                                }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`
                                            aspect-square
                                            rounded-md

                                            ${
                                                i % 5 === 0
                                                    ? "bg-green-500"
                                                    : i % 3 ===
                                                      0
                                                    ? "bg-green-400/70"
                                                    : i % 2 ===
                                                      0
                                                    ? "bg-green-300/50"
                                                    : "bg-neutral-200 dark:bg-neutral-800"
                                            }
                                        `}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="space-y-6 lg:col-span-4">

                        {/* Goal Card */}
                        <div
                            className="
                                rounded-3xl

                                bg-gradient-to-br
                                from-[#ffa116]
                                to-orange-500

                                p-6

                                text-white
                            "
                        >
                            <div
                                className="
                                    flex h-12 w-12
                                    items-center justify-center

                                    rounded-2xl

                                    bg-white/15
                                "
                            >
                                <Target size={22} />
                            </div>

                            <h2 className="mt-5 text-2xl font-bold">
                                Daily Goal
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/80">
                                Solve 5 problems daily to
                                maintain your streak and boost
                                interview confidence.
                            </p>

                            {/* Progress */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">
                                        Progress
                                    </span>

                                    <span className="text-sm font-semibold">
                                        3 / 5
                                    </span>
                                </div>

                                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
                                    <div className="h-full w-[60%] rounded-full bg-white" />
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div
                            className="
                                rounded-3xl
                                border border-neutral-200
                                bg-white

                                p-6

                                shadow-sm

                                dark:border-neutral-800
                                dark:bg-[#1a1a1a]
                            "
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2
                                        className="
                                            text-xl font-bold
                                            text-black

                                            dark:text-white
                                        "
                                    >
                                        Recent Activity
                                    </h2>

                                    <p className="mt-1 text-sm text-neutral-500">
                                        Recently solved
                                        problems
                                    </p>
                                </div>

                                <Clock3
                                    size={20}
                                    className="text-[#ffa116]"
                                />
                            </div>

                            {/* Activity List */}
                            <div className="mt-6 space-y-4">
                                {recentActivity.map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="
                                                flex items-center
                                                justify-between

                                                rounded-2xl
                                                border border-neutral-200

                                                p-4

                                                transition-all duration-200

                                                hover:border-[#ffa116]
                                                hover:bg-[#fff7ed]

                                                dark:border-neutral-800
                                                dark:hover:bg-[#2a241c]
                                            "
                                        >
                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="
                                                        flex h-10 w-10
                                                        items-center
                                                        justify-center

                                                        rounded-xl

                                                        bg-green-500/10

                                                        text-green-500
                                                    "
                                                >
                                                    <CheckCircle2
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <h3
                                                        className="
                                                            text-sm
                                                            font-semibold

                                                            text-black

                                                            dark:text-white
                                                        "
                                                    >
                                                        {
                                                            item.name
                                                        }
                                                    </h3>

                                                    <p className="mt-1 text-xs text-neutral-500">
                                                        Solved{" "}
                                                        {
                                                            item.time
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;