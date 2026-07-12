"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
    ExternalLink,
    TrendingUp,
    ChevronDown,
    Check,
} from "lucide-react";
import globalProblems from "@/constants/data/globalProblems.json";
import type { GlobalProblem } from "@/constants/problemData";
import { useFilterStore } from "@/store/filterStore";
import { useProblemStore } from "@/store/problemStore";

const problems = globalProblems as GlobalProblem[];

/* ---------------- Styles ---------------- */

const difficultyColors: Record<string, string> = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-red-500",
};

/* ---------------- Subcomponents for Row State Management ---------------- */

const CompanyDropdown = ({ companies }: { companies: string[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasMoreThanTwo = companies.length > 2;
    const displayedCompanies = hasMoreThanTwo ? companies.slice(0, 2) : companies;

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Main visible line */}
            <div className="flex items-center flex-wrap gap-1.5">
                {displayedCompanies.map((company, idx) => (
                    <Link
                        key={idx}
                        href={`/Company/${encodeURIComponent(company)}`}
                        className="
                            rounded-lg border border-neutral-300
                            bg-linear-to-b from-white to-neutral-100
                            px-2.5 py-0.5 text-[11px] font-semibold
                            tracking-wide text-neutral-700 transition-all duration-200
                            hover:-translate-y-0.5 hover:border-[#ffa116] hover:text-[#ffa116]
                            dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800
                            dark:text-neutral-300
                        "
                    >
                        {company}
                    </Link>
                ))}

                {hasMoreThanTwo && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="
                            flex h-5 w-5 items-center justify-center flex-shrink-0
                            rounded-full border border-neutral-300
                            bg-linear-to-b from-white to-neutral-100
                            text-neutral-500 transition-all duration-200
                            hover:border-[#ffa116] hover:text-[#ffa116]
                            dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800
                        "
                    >
                        <ChevronDown size={10} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                )}
            </div>

            {/* Below content block populated on click */}
            {hasMoreThanTwo && isOpen && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-dashed border-neutral-200 dark:border-neutral-800 animate-fadeIn">
                    {companies.slice(2).map((company, idx) => (
                        <Link
                            key={idx}
                            href={`/Company/${encodeURIComponent(company)}`}
                            className="
                                rounded-full border border-neutral-300
                                bg-linear-to-b from-white to-neutral-100
                                px-2.5 py-0.5 text-[11px] font-semibold
                                tracking-wide text-neutral-700 transition-all duration-200
                                hover:-translate-y-0.5 hover:border-[#ffa116] hover:text-[#ffa116]
                                dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800
                                dark:text-neutral-300
                            "
                        >
                            {company}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

const TopicsList = ({ topics }: { topics: string[] }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedTopics = showAll ? topics : topics.slice(0, 2);

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Top row */}
            <div className="flex items-center flex-wrap gap-1.5">
                {!showAll && displayedTopics.map((topic, idx) => (
                    <span
                        key={idx}
                        className="
                            rounded-lg bg-[#ffa116]/10 px-2.5 py-0.5
                            text-[11px] font-medium tracking-wide text-[#ff9f0a]
                            transition-all duration-200 hover:scale-105
                            hover:bg-[#ffa116] hover:text-white
                        "
                    >
                        {topic}
                    </span>
                ))}
                {topics.length > 2 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-400 cursor-pointer transition-colors hover:bg-neutral-200 dark:bg-[#222] dark:hover:bg-neutral-800 flex-shrink-0"
                    >
                        {showAll ? "Show less" : `+${topics.length - 2}`}
                    </button>
                )}
            </div>

            {/* Flow everything vertically downwards underneath if expanded */}
            {showAll && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                    {topics.map((topic, idx) => (
                        <span
                            key={idx}
                            className="
                                rounded-lg bg-[#ffa116]/10 px-2.5 py-0.5
                                text-[11px] font-medium tracking-wide text-[#ff9f0a]
                            "
                        >
                            {topic}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ---------------- Main Component ---------------- */

const ProblemCard = () => {
    const {
        searchQuery,
        activeTopic,
        difficultyFilter,
        solvedFilter,
        sortBy,
        sortOrder,
    } = useFilterStore();

    const { solvedProblems, toggleSolved } = useProblemStore();
    const [isMounted, setIsMounted] = useState(false);
    const [visibleCount, setVisibleCount] = useState(50);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Filter, sort, and search problems client-side
    const filteredAndSortedProblems = useMemo(() => {
        let result = [...problems];

        // 1. Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    p.topics.some((t) => t.toLowerCase().includes(query)) ||
                    p.companies.some((c) => c.toLowerCase().includes(query))
            );
        }

        // 2. Topic filter
        if (activeTopic) {
            const topicLower = activeTopic.toLowerCase().trim();
            result = result.filter((p) =>
                p.topics.some((t) => t.toLowerCase() === topicLower)
            );
        }

        // 3. Difficulty filter
        if (difficultyFilter && difficultyFilter !== "All") {
            result = result.filter(
                (p) => p.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
            );
        }

        // 4. Solved filter
        if (solvedFilter && solvedFilter !== "All") {
            result = result.filter((p) => {
                const key = p.title.toLowerCase().trim();
                const isSolved = isMounted && !!solvedProblems[key];
                return solvedFilter === "Solved" ? isSolved : !isSolved;
            });
        }

        // 5. Sorting
        result.sort((a, b) => {
            let valA: any = 0;
            let valB: any = 0;

            if (sortBy === "frequency") {
                valA = a.frequency;
                valB = b.frequency;
            } else if (sortBy === "acceptance") {
                valA = a.acceptance;
                valB = b.acceptance;
            } else if (sortBy === "difficulty") {
                const diffMap = { Easy: 1, Medium: 2, Hard: 3 };
                valA = diffMap[a.difficulty] || 0;
                valB = diffMap[b.difficulty] || 0;
            }

            if (valA !== valB) {
                return sortOrder === "asc" ? valA - valB : valB - valA;
            }
            // Secondary sort by ID
            return a.id - b.id;
        });

        return result;
    }, [problems, searchQuery, activeTopic, difficultyFilter, solvedFilter, sortBy, sortOrder, solvedProblems, isMounted]);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(50);
    }, [searchQuery, activeTopic, difficultyFilter, solvedFilter, sortBy, sortOrder]);

    // Infinite Scroll Intersection Observer
    useEffect(() => {
        const currentTarget = observerTarget.current;
        if (!currentTarget) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 50, filteredAndSortedProblems.length));
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(currentTarget);

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [filteredAndSortedProblems.length, visibleCount]);

    // Visible subset of problems
    const visibleProblems = useMemo(() => {
        return filteredAndSortedProblems.slice(0, visibleCount);
    }, [filteredAndSortedProblems, visibleCount]);

    return (
        <div className="flex flex-col gap-4">
            <div
                className="
                    overflow-hidden rounded-2xl
                    border border-neutral-200
                    bg-white
                    shadow-sm
                    dark:border-neutral-800
                    dark:bg-[#1a1a1a]
                "
            >
                {/* Header */}
                <div
                    className="
                        grid grid-cols-13
                        border-b border-neutral-200
                        bg-neutral-100
                        px-6 py-4
                        text-xs font-semibold uppercase
                        tracking-wide text-neutral-500
                        dark:border-neutral-800
                        dark:bg-[#222]
                    "
                >
                    <div className="col-span-4">Problem</div>
                    <div className="col-span-1">Difficulty</div>
                    <div className="col-span-1">Acceptance</div>
                    <div className="col-span-2">Frequency</div>
                    <div className="col-span-2">Companies</div>
                    <div className="col-span-2">Topics</div>
                    <div className="col-span-1 text-right pr-2">Status</div>
                </div>

                {/* Rows */}
                {visibleProblems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400 dark:text-neutral-500">
                        <TrendingUp size={48} className="mb-4 opacity-30" />
                        <p className="text-lg font-medium">No problems match your filters</p>
                        <p className="mt-1 text-sm">Try resetting filters or changing your search term</p>
                    </div>
                ) : (
                    visibleProblems.map((problem, index) => {
                        const key = problem.title.toLowerCase().trim();
                        const isSolved = isMounted && !!solvedProblems[key];

                        return (
                            <div
                                key={problem.id}
                                className={`
                                    group
                                    grid grid-cols-13
                                    items-start
                                    px-6 py-4
                                    transition-all duration-200
                                    
                                    ${isSolved
                                        ? "bg-green-50/20 hover:bg-green-100/30 dark:bg-green-500/5 dark:hover:bg-green-500/10"
                                        : "hover:bg-[#f9f7f4] dark:hover:bg-[#242424]"
                                    }
                                    hover:shadow-inner

                                    ${index % 2 === 0 && !isSolved
                                        ? "bg-white dark:bg-[#1a1a1a]"
                                        : !isSolved
                                            ? "bg-neutral-50/60 dark:bg-[#1f1f1f]"
                                            : ""
                                    }

                                    ${index !== visibleProblems.length - 1
                                        ? "border-b border-neutral-200 dark:border-neutral-800"
                                        : ""
                                    }
                                `}
                            >
                                {/* Problem */}
                                <div className="col-span-4 flex items-center gap-4 min-w-0 self-center">
                                    <span className="text-sm text-neutral-500 transition group-hover:text-[#ffa116] flex-shrink-0">
                                        {problem.id}.
                                    </span>

                                    <Link
                                        href={problem.link || "#"}
                                        target={problem.link !== "#" ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        className="
                                            flex items-center gap-2
                                            text-sm font-medium
                                            text-neutral-800
                                            transition-all duration-200
                                            hover:text-[#ffa116]
                                            dark:text-neutral-100
                                            truncate
                                        "
                                    >
                                        <span className="truncate">{problem.title}</span>
                                        <ExternalLink
                                            size={14}
                                            className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 flex-shrink-0"
                                        />
                                    </Link>
                                </div>

                                {/* Difficulty */}
                                <div className={`col-span-1 text-sm font-semibold self-center ${difficultyColors[problem.difficulty]}`}>
                                    {problem.difficulty}
                                </div>

                                {/* Acceptance */}
                                <div className="col-span-1 text-sm text-neutral-700 dark:text-neutral-300 self-center">
                                    {problem.acceptance.toFixed(1)}%
                                </div>

                                {/* Frequency */}
                                <div className="col-span-2 self-center">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            <TrendingUp size={14} className="text-[#ffa116]" />
                                            <span className="text-xs font-medium text-[#ffa116]">
                                                {problem.frequency.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Companies Section */}
                                <div className="col-span-2 overflow-visible pt-1">
                                    <CompanyDropdown companies={problem.companies} />
                                </div>

                                {/* Topics Section */}
                                <div className="col-span-2 overflow-visible pt-1">
                                    <TopicsList topics={problem.topics} />
                                </div>

                                {/* Action box */}
                                <div className="col-span-1 mr-2 flex justify-end pr-2 self-center">
                                    <button
                                        onClick={() =>
                                            toggleSolved({
                                                title: problem.title,
                                                difficulty: problem.difficulty,
                                                acceptance: problem.acceptance,
                                                frequency: problem.frequency,
                                                companies: problem.companies,
                                                topics: problem.topics,
                                                link: problem.link,
                                            })
                                        }
                                        className={`
                                            flex h-5 w-5 items-center justify-center rounded border transition-all duration-150
                                            ${isSolved
                                                ? "border-green-500 bg-green-500 text-white"
                                                : "border-neutral-300 bg-white hover:border-[#ffa116] dark:border-neutral-600 dark:bg-[#222]"
                                            }
                                        `}
                                    >
                                        {isSolved && <Check size={13} strokeWidth={3} />}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Observer Target (for loading spinner) */}
                {visibleCount < filteredAndSortedProblems.length && (
                    <div
                        ref={observerTarget}
                        className="flex items-center justify-center py-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/20 dark:bg-neutral-900/10"
                    >
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-[#ffa116]" />
                            Loading more problems...
                        </div>
                    </div>
                )}
            </div>

            {/* Dynamic Stats Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#1a1a1a] shadow-sm">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Showing <span className="font-semibold text-black dark:text-white">{Math.min(visibleCount, filteredAndSortedProblems.length)}</span> of{" "}
                    <span className="font-semibold text-black dark:text-white">{filteredAndSortedProblems.length}</span> matching problems 
                    {filteredAndSortedProblems.length !== problems.length && (
                        <span> (filtered from {problems.length})</span>
                    )}
                </div>
                {visibleCount >= filteredAndSortedProblems.length && filteredAndSortedProblems.length > 0 && (
                    <div className="text-xs font-semibold text-[#ffa116]">
                        All matching problems loaded
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemCard;