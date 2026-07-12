"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
    Search,
    ArrowUp,
    ArrowDown,
    FilterX,
} from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import { useProblemStore } from "@/store/problemStore";
import globalProblems from "@/constants/data/globalProblems.json";
import type { GlobalProblem } from "@/constants/problemData";

const problems = globalProblems as GlobalProblem[];

const FilterSection = () => {
    const {
        searchQuery,
        activeTopic,
        difficultyFilter,
        solvedFilter,
        sortBy,
        sortOrder,
        currentPage,
        itemsPerPage,
        setSearchQuery,
        setDifficultyFilter,
        setSolvedFilter,
        setSortBy,
        resetFilters,
    } = useFilterStore();

    const { solvedProblems } = useProblemStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Calculate dynamic stats
    const filteredCount = useMemo(() => {
        let result = problems;

        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    p.topics.some((t) => t.toLowerCase().includes(query)) ||
                    p.companies.some((c) => c.toLowerCase().includes(query))
            );
        }

        if (activeTopic) {
            const tLower = activeTopic.toLowerCase().trim();
            result = result.filter((p) =>
                p.topics.some((t) => t.toLowerCase() === tLower)
            );
        }

        if (difficultyFilter && difficultyFilter !== "All") {
            result = result.filter(
                (p) => p.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
            );
        }

        if (solvedFilter && solvedFilter !== "All" && isMounted) {
            result = result.filter((p) => {
                const key = p.title.toLowerCase().trim();
                const isSolved = !!solvedProblems[key];
                return solvedFilter === "Solved" ? isSolved : !isSolved;
            });
        }

        return result.length;
    }, [searchQuery, activeTopic, difficultyFilter, solvedFilter, solvedProblems, isMounted]);

    const startItem = filteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredCount);

    const hasActiveFilters = searchQuery || activeTopic || difficultyFilter !== "All" || solvedFilter !== "All";

    return (
        <div
            className="
                mb-6 flex flex-col gap-4
                border-b border-neutral-200
                bg-white
                px-10 py-5
                rounded-xl mt-3
                shadow-sm

                dark:border-neutral-800
                dark:bg-[#1a1a1a]
            "
        >
            {/* Top Row */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Left Side: Search & Filter Options */}
                <div className="flex flex-wrap items-center gap-3">

                    {/* Search */}
                    <div
                        className="
                            flex h-10 w-full items-center gap-3
                            rounded-lg
                            border border-neutral-300
                            bg-neutral-50
                            px-3

                            transition-all duration-200

                            focus-within:border-[#ffa116]
                            focus-within:bg-white

                            dark:border-neutral-700
                            dark:bg-[#222]
                            dark:focus-within:bg-[#262626]

                            lg:w-[320px]
                        "
                    >
                        <Search
                            size={17}
                            className="text-neutral-500"
                        />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search problems, topics, companies..."
                            className="
                                w-full bg-transparent
                                text-sm
                                text-neutral-700
                                outline-none

                                placeholder:text-neutral-500

                                dark:text-neutral-200
                            "
                        />
                    </div>

                    {/* Difficulty Dropdown */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Diff:</span>
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="
                                text-xs rounded-lg border border-neutral-300 bg-neutral-50 px-2.5 py-2 font-medium outline-none cursor-pointer
                                transition-all duration-200 hover:border-[#ffa116]
                                dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300
                            "
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    {/* Solved Status Dropdown */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Status:</span>
                        <select
                            value={solvedFilter}
                            onChange={(e) => setSolvedFilter(e.target.value)}
                            className="
                                text-xs rounded-lg border border-neutral-300 bg-neutral-50 px-2.5 py-2 font-medium outline-none cursor-pointer
                                transition-all duration-200 hover:border-[#ffa116]
                                dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300
                            "
                        >
                            <option value="All">All Statuses</option>
                            <option value="Solved">Solved</option>
                            <option value="Unsolved">Unsolved</option>
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="
                                flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3
                                text-xs font-semibold text-red-600 transition-all duration-200 hover:bg-red-100/70
                                dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40
                            "
                        >
                            <FilterX size={13} />
                            Reset Filters
                        </button>
                    )}
                </div>

                {/* Right Side: Sorting Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <p className="mr-2 text-sm font-medium">Sort by:</p>

                    {/* Frequency Sort Button */}
                    <button
                        onClick={() => setSortBy("frequency")}
                        className={`
                            flex h-10 items-center gap-2
                            rounded-lg
                            border px-4
                            text-sm font-medium
                            transition-all duration-200
                            ${sortBy === "frequency"
                                ? "border-[#ffa116] bg-[#fff7ed] text-[#ffa116] dark:bg-[#2a241c] dark:text-[#ffa116]"
                                : "border-neutral-300 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300 hover:border-[#ffa116]"
                            }
                        `}
                    >
                        <span>Frequency</span>
                        {sortBy === "frequency" && (
                            sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                    </button>

                    {/* Acceptance Sort Button */}
                    <button
                        onClick={() => setSortBy("acceptance")}
                        className={`
                            flex h-10 items-center gap-2
                            rounded-lg
                            border px-4
                            text-sm font-medium
                            transition-all duration-200
                            ${sortBy === "acceptance"
                                ? "border-[#ffa116] bg-[#fff7ed] text-[#ffa116] dark:bg-[#2a241c] dark:text-[#ffa116]"
                                : "border-neutral-300 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300 hover:border-[#ffa116]"
                            }
                        `}
                    >
                        <span>Acceptance</span>
                        {sortBy === "acceptance" && (
                            sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                    </button>

                    {/* Difficulty Sort Button */}
                    <button
                        onClick={() => setSortBy("difficulty")}
                        className={`
                            flex h-10 items-center gap-2
                            rounded-lg
                            border px-4
                            text-sm font-medium
                            transition-all duration-200
                            ${sortBy === "difficulty"
                                ? "border-[#ffa116] bg-[#fff7ed] text-[#ffa116] dark:bg-[#2a241c] dark:text-[#ffa116]"
                                : "border-neutral-300 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300 hover:border-[#ffa116]"
                            }
                        `}
                    >
                        <span>Difficulty</span>
                        {sortBy === "difficulty" && (
                            sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                    </button>
                </div>
            </div>

            {/* Bottom Row: Dynamic stats & info */}
            <div className="flex items-center justify-between">

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-neutral-500">
                        Total:
                        <span className="ml-1 font-semibold text-black dark:text-white">
                            {problems.length}
                        </span>
                    </span>

                    {hasActiveFilters && (
                        <span className="text-neutral-500">
                            Filtered:
                            <span className="ml-1 font-semibold text-[#ffa116]">
                                {filteredCount}
                            </span>
                        </span>
                    )}

                    <span className="text-neutral-500">
                        Showing:
                        <span className="ml-1 font-semibold text-black dark:text-white">
                            {startItem}-{endItem}
                        </span>
                    </span>

                    {activeTopic && (
                        <span className="rounded-md bg-[#ffa116]/10 px-2 py-0.5 text-xs font-semibold text-[#ff9f0a]">
                            Topic: {activeTopic}
                        </span>
                    )}
                </div>

                {/* Difficulty Legend */}
                <div className="hidden items-center gap-4 md:flex">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-neutral-500">Easy</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="text-neutral-500">Medium</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-neutral-500">Hard</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;