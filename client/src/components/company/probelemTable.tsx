"use client";

import React from "react";
import Link from "next/link";
import { Check, Clock3, ExternalLink, TrendingUp } from "lucide-react";
import {
    normalizeDifficulty,
    formatAcceptance,
    type ProblemRecord,
} from "@/constants/comapnyData";

export interface ProblemRow {
    id: number;
    name: string;
    difficulty: "Easy" | "Medium" | "Hard";
    acceptance: string;
    frequency: string;
    topics: string[];
    companies: string[];
    solved: boolean;
    solvedAt: string;
    link: string;
}

interface ProbelemTableProps {
    problems?: ProblemRecord[];
    solvedSet?: Set<string>;
    onToggleSolved?: (title: string) => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
    Easy: "bg-green-500/10 text-green-500",
    Medium: "bg-yellow-500/10 text-yellow-500",
    Hard: "bg-red-500/10 text-red-500",
};

const ProbelemTable = ({
    problems = [],
    solvedSet = new Set(),
    onToggleSolved,
}: ProbelemTableProps) => {

    if (problems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#1a1a1a]">
                <TrendingUp size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium">No problems found</p>
                <p className="mt-1 text-sm">Try adjusting your filters or selecting a different duration</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#1a1a1a]">

            {/* Header */}
            <div className="grid grid-cols-12 border-b border-neutral-200 bg-neutral-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:bg-[#202020]">
                <div className="col-span-4">Problem</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-2">Acceptance</div>
                <div className="col-span-1">Frequency</div>
                <div className="col-span-2">Topics</div>
                <div className="col-span-1 text-center">Solved</div>
            </div>

            {/* Rows */}
            {problems.map((problem, index) => {
                const difficulty = normalizeDifficulty(problem.Difficulty ?? "MEDIUM");
                const acceptance = formatAcceptance(problem["Acceptance Rate"] ?? 0);
                const frequency = `${(problem.Frequency ?? 0).toFixed(1)}%`;
                const topics = problem.Topics
                    ? problem.Topics.split(",").map((t) => t.trim()).filter(Boolean)
                    : [];
                const isSolved = solvedSet.has(problem.Title);

                return (
                    <div
                        key={index}
                        className={`group grid grid-cols-12 items-center border-b border-neutral-200 px-6 py-5 transition-all duration-200 ${isSolved
                            ? "bg-green-50 hover:bg-green-100/70 dark:bg-green-500/5 dark:hover:bg-green-500/10"
                            : "hover:bg-[#fff7ed] dark:hover:bg-[#2a241c]"
                            } dark:border-neutral-800`}
                    >
                        {/* Problem */}
                        <div className="col-span-4 flex items-center gap-3">
                            <span className="text-sm text-neutral-400">
                                {index + 1}.
                            </span>

                            <div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={problem.Link || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-black transition-colors duration-200 group-hover:text-[#ffa116] dark:text-white flex items-center gap-1.5"
                                    >
                                        {problem.Title}
                                    </Link>
                                </div>

                                {isSolved && (
                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                                        <Clock3 size={11} />
                                        Solved
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div className="col-span-2">
                            <span
                                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${DIFFICULTY_STYLES[difficulty]}`}
                            >
                                {difficulty}
                            </span>
                        </div>

                        {/* Acceptance */}
                        <div className="col-span-2">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                {acceptance}
                            </span>
                        </div>

                        {/* Frequency */}
                        <div className="col-span-1">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-medium text-[#ffa116]">
                                    {frequency}
                                </span>
                                <div className="h-1.5 w-14 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                                    <div
                                        style={{ width: `${Math.min(problem.Frequency ?? 0, 100)}%` }}
                                        className="h-full rounded-full bg-[#ffa116]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Topics */}
                        <div className="col-span-2 flex flex-wrap gap-1.5">
                            {topics.slice(0, 2).map((topic, idx) => (
                                <span
                                    key={idx}
                                    className="rounded-md border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-600 transition-all duration-200 group-hover:border-[#ffa116] group-hover:text-[#ffa116] dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300"
                                >
                                    {topic}
                                </span>
                            ))}
                            {topics.length > 2 && (
                                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-400 dark:bg-[#222]">
                                    +{topics.length - 2}
                                </span>
                            )}
                        </div>

                        {/* Solved */}
                        <div className="col-span-1 flex justify-center">
                            <button
                                onClick={() => onToggleSolved?.(problem.Title)}
                                className={`flex h-5 w-5 items-center justify-center rounded border transition-all duration-200 ${isSolved
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-neutral-300 bg-white hover:border-[#ffa116] dark:border-neutral-600 dark:bg-[#222]"
                                    }`}
                            >
                                {isSolved && (
                                    <Check
                                        size={13}
                                        strokeWidth={3}
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProbelemTable;