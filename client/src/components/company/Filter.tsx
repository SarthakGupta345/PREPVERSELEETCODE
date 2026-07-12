"use client";

import React from "react";
import {
    ArrowUp,
    ArrowDown,
    Flame,
    ShieldAlert,
    CalendarClock,
    Search,
    ChevronDown,
} from "lucide-react";

interface FilterProps {
    frequencyOrder: "asc" | "desc";
    difficultyFilter: string;
    lastSolvedFilter: string;
    searchQuery: string;
    selectedDuration: string;
    totalProblems: number;
    showing: number;
    onFrequencyOrderChange: (order: "asc" | "desc") => void;
    onDifficultyFilterChange: (difficulty: string) => void;
    onLastSolvedFilterChange: (filter: string) => void;
    onSearchChange: (query: string) => void;
    onDurationChange: (duration: string) => void;
}

const DIFFICULTIES = ["", "Easy", "Medium", "Hard"];
const DURATION_OPTIONS = ["All", "30 Days", "3 Months", "6 Months"];
const SOLVED_OPTIONS = ["All", "Solved", "Unsolved"];

const Filter = ({
    frequencyOrder,
    difficultyFilter,
    lastSolvedFilter,
    searchQuery,
    selectedDuration,
    totalProblems,
    showing,
    onFrequencyOrderChange,
    onDifficultyFilterChange,
    onLastSolvedFilterChange,
    onSearchChange,
    onDurationChange,
}: FilterProps) => {
    return (
        <div className="mb-3 flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm dark:border-neutral-800 dark:bg-[#1a1a1a] lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div className="flex flex-wrap items-center gap-3">

                {/* Label */}
                <span className="text-sm font-medium text-neutral-500">
                    Filter & Sort:
                </span>

                {/* Frequency */}
                <button
                    onClick={() =>
                        onFrequencyOrderChange(
                            frequencyOrder === "asc" ? "desc" : "asc"
                        )
                    }
                    className="group flex items-center gap-2 rounded-lg border border-[#ffa116] bg-[#fff7ed] px-3 py-2 text-sm font-medium text-[#ffa116] transition-all duration-200 dark:border-[#ffa116]/40 dark:bg-[#2a241c]"
                >
                    <Flame size={15} />
                    Frequency
                    {frequencyOrder === "asc" ? (
                        <ArrowUp size={14} />
                    ) : (
                        <ArrowDown size={14} />
                    )}
                </button>

                {/* Duration */}
                <div className="relative">
                    <select
                        value={selectedDuration}
                        onChange={(e) => onDurationChange(e.target.value)}
                        className="appearance-none rounded-lg border border-neutral-300 bg-neutral-50 py-2 pl-3 pr-9 text-sm font-medium text-neutral-700 outline-none transition-all duration-200 hover:border-[#ffa116] hover:bg-[#fff7ed] dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300"
                    >
                        {DURATION_OPTIONS.map((d) => (
                            <option key={d}>{d}</option>
                        ))}
                    </select>

                    <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    />
                </div>

                {/* Difficulty */}
                <div className="relative">
                    <select
                        value={difficultyFilter}
                        onChange={(e) => onDifficultyFilterChange(e.target.value)}
                        className="appearance-none rounded-lg border border-neutral-300 bg-neutral-50 py-2 pl-3 pr-9 text-sm font-medium text-neutral-700 outline-none transition-all duration-200 hover:border-[#ffa116] hover:bg-[#fff7ed] dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300"
                    >
                        <option value="">All Difficulties</option>
                        {["Easy", "Medium", "Hard"].map((d) => (
                            <option key={d}>{d}</option>
                        ))}
                    </select>

                    <ShieldAlert
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        style={{ display: "none" }}
                    />

                    <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    />
                </div>

                {/* Solved Filter */}
                <div className="relative">
                    <select
                        value={lastSolvedFilter}
                        onChange={(e) =>
                            onLastSolvedFilterChange(e.target.value)
                        }
                        className="appearance-none rounded-lg border border-neutral-300 bg-neutral-50 py-2 pl-3 pr-9 text-sm font-medium text-neutral-700 outline-none transition-all duration-200 hover:border-[#ffa116] hover:bg-[#fff7ed] dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300"
                    >
                        {SOLVED_OPTIONS.map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>

                    <CalendarClock
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        style={{ display: "none" }}
                    />
                    <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    />
                </div>
            </div>

            {/* Right: Stats + Search */}
            <div className="flex items-center gap-3">
                {/* Stats */}
                <span className="hidden text-xs text-neutral-500 md:block">
                    {showing}/{totalProblems} problems
                </span>

                {/* Search */}
                <div className="flex h-10 w-full items-center gap-3 rounded-lg border border-neutral-300 bg-neutral-50 px-3 transition-all duration-200 focus-within:border-[#ffa116] focus-within:bg-white dark:border-neutral-700 dark:bg-[#222] lg:w-[280px]">
                    <Search
                        size={16}
                        className="text-neutral-500"
                    />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search questions..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500 dark:text-white"
                    />
                </div>
            </div>
        </div>
    );
};

export default Filter;