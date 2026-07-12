"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import Progress from "@/components/company/pgoress";
import PopularTopics from "@/components/company/topics";
import Filter from "@/components/company/Filter";
import ProbelemTable from "@/components/company/probelemTable";
import {
    type CompanyData,
    type ProblemRecord,
    resolveDuration,
    computeStats,
    extractTopics,
    normalizeDifficulty,
} from "@/constants/comapnyData";
import { useProblemStore } from "@/store/problemStore";
import { useMe } from "@/hooks/useAuth";
import { useCompanyProblems } from "@/hooks/useCompany";
import { useMarkProblemDone, useMarkProblemUndone } from "@/hooks/useProblems";

interface CompanyDashboardProps {
    companyData: CompanyData;
}

const CompanyDashboard = ({ companyData }: CompanyDashboardProps) => {
    const companyName = companyData.company;

    const { solvedProblems, toggleSolved } = useProblemStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: meData } = useMe();
    const isLoggedIn = !!meData?.success;

    const [selectedDuration, setSelectedDuration] = useState("All");
    const [frequencyOrder, setFrequencyOrder] = useState<"asc" | "desc">("desc");
    const [difficultyFilter, setDifficultyFilter] = useState<string>("");
    const [lastSolvedFilter, setLastSolvedFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTopic, setActiveTopic] = useState("");

    const DurationParamMap: Record<string, "30_days" | "3_months" | "6_months" | "all"> = {
        "30 Days": "30_days",
        "3 Months": "3_months",
        "6 Months": "6_months",
        "All": "all",
    };

    const { data: apiProblemsResponse } = useCompanyProblems(
        companyName,
        {
            period: DurationParamMap[selectedDuration] || "all",
            limit: 2000,
        },
        {
            enabled: isMounted,
        }
    );

    const markDone = useMarkProblemDone();
    const markUndone = useMarkProblemUndone();

    // Create a Set of titles solved from global solvedProblems store
    const solvedSet = useMemo(() => {
        if (!isMounted) return new Set<string>();
        return new Set(
            Object.values(solvedProblems).map((p: any) => p.title)
        );
    }, [solvedProblems, isMounted]);

    // Sync API solved status to Zustand store
    useEffect(() => {
        if (isLoggedIn && apiProblemsResponse?.success && apiProblemsResponse?.data?.problems) {
            apiProblemsResponse.data.problems.forEach((p: any) => {
                if (p.isSolved) {
                    const key = p.title.toLowerCase().trim();
                    if (!solvedProblems[key]) {
                        toggleSolved({
                            title: p.title,
                            difficulty: normalizeDifficulty(p.difficulty),
                            acceptance: p.acceptanceRate <= 1 ? p.acceptanceRate * 100 : p.acceptanceRate,
                            frequency: p.frequency,
                            companies: [companyName],
                            topics: p.topics ? p.topics.map((t: any) => t.name) : [],
                            link: p.link || "#",
                        });
                    }
                }
            });
        }
    }, [isLoggedIn, apiProblemsResponse, companyName, toggleSolved, solvedProblems]);

    const allRecords: ProblemRecord[] = useMemo(() => {
        if (apiProblemsResponse?.success && apiProblemsResponse?.data?.problems) {
            return apiProblemsResponse.data.problems.map((p: any) => ({
                id: p.id,
                Title: p.title,
                Difficulty: p.difficulty,
                "Acceptance Rate": p.acceptanceRate <= 1 ? p.acceptanceRate * 100 : p.acceptanceRate,
                Frequency: p.frequency,
                Link: p.link,
                companies: companyName,
                Topics: p.topics ? p.topics.map((t: any) => t.name).join(", ") : "",
            }));
        }
        return [];
    }, [apiProblemsResponse, companyName]);

    // Compute difficulty stats from all records for progress bar
    const stats = useMemo(() => {
        const s = computeStats(allRecords);
        return {
            easySolved: Array.from(solvedSet).filter((title) => {
                const rec = allRecords.find((r) => r.Title === title);
                return rec && rec.Difficulty?.toUpperCase() === "EASY";
            }).length,
            easyTotal: s.easy,
            mediumSolved: Array.from(solvedSet).filter((title) => {
                const rec = allRecords.find((r) => r.Title === title);
                return rec && rec.Difficulty?.toUpperCase() === "MEDIUM";
            }).length,
            mediumTotal: s.medium,
            hardSolved: Array.from(solvedSet).filter((title) => {
                const rec = allRecords.find((r) => r.Title === title);
                return rec && rec.Difficulty?.toUpperCase() === "HARD";
            }).length,
            hardTotal: s.hard,
        };
    }, [allRecords, solvedSet]);

    // Compute topics from all records
    const topics = useMemo(() => extractTopics(allRecords), [allRecords]);

    // Filter and sort problems
    const filteredProblems = useMemo(() => {
        let filtered = [...allRecords];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.Title?.toLowerCase().includes(q) ||
                    p.Topics?.toLowerCase().includes(q)
            );
        }

        // Topic filter
        if (activeTopic) {
            filtered = filtered.filter((p) =>
                p.Topics?.toLowerCase().includes(activeTopic.toLowerCase())
            );
        }

        // Difficulty filter
        if (difficultyFilter) {
            filtered = filtered.filter(
                (p) => normalizeDifficulty(p.Difficulty) === difficultyFilter
            );
        }

        // Solved/Unsolved filter
        if (lastSolvedFilter === "Unsolved") {
            filtered = filtered.filter((p) => !solvedSet.has(p.Title));
        } else if (lastSolvedFilter === "Solved") {
            filtered = filtered.filter((p) => solvedSet.has(p.Title));
        }

        // Sort by frequency
        filtered.sort((a, b) => {
            const freqA = a.Frequency ?? 0;
            const freqB = b.Frequency ?? 0;
            return frequencyOrder === "desc"
                ? freqB - freqA
                : freqA - freqB;
        });

        return filtered;
    }, [allRecords, searchQuery, activeTopic, difficultyFilter, lastSolvedFilter, frequencyOrder, solvedSet]);

    const handleToggleSolved = useCallback(
        async (title: string) => {
            const problem = allRecords.find((r) => r.Title === title);
            if (!problem) return;

            const difficulty = normalizeDifficulty(problem.Difficulty);
            const acceptance = problem["Acceptance Rate"] <= 1 ? problem["Acceptance Rate"] * 100 : problem["Acceptance Rate"];
            const frequency = problem.Frequency ?? 0;
            const topicsList = problem.Topics ? problem.Topics.split(",").map(t => t.trim()).filter(Boolean) : [];

            // Toggle in Zustand store for immediate UI response
            toggleSolved({
                title: problem.Title,
                difficulty,
                acceptance,
                frequency,
                companies: [companyName],
                topics: topicsList,
                link: problem.Link || "#",
            });

            // Sync to backend if logged in and has an id
            if (isLoggedIn && problem.id) {
                const isCurrentlySolved = solvedSet.has(title);
                try {
                    if (isCurrentlySolved) {
                        await markUndone.mutateAsync(problem.id);
                    } else {
                        await markDone.mutateAsync(problem.id);
                    }
                } catch (error) {
                    console.error("Failed to update problem solved status on backend:", error);
                }
            }
        },
        [allRecords, companyName, toggleSolved, isLoggedIn, solvedSet, markDone, markUndone]
    );

    return (
        <div>
            {/* Top Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Progress */}
                <div className="flex lg:col-span-5">
                    <div className="w-full">
                        <Progress stats={stats} />
                    </div>
                </div>

                {/* Topics */}
                <div className="flex lg:col-span-7">
                    <div className="w-full">
                        <PopularTopics
                            topics={topics}
                            companyName={companyName}
                            activeTopic={activeTopic}
                            onTopicClick={setActiveTopic}
                        />
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <Filter
                frequencyOrder={frequencyOrder}
                difficultyFilter={difficultyFilter}
                lastSolvedFilter={lastSolvedFilter}
                searchQuery={searchQuery}
                selectedDuration={selectedDuration}
                totalProblems={allRecords.length}
                showing={filteredProblems.length}
                onFrequencyOrderChange={setFrequencyOrder}
                onDifficultyFilterChange={setDifficultyFilter}
                onLastSolvedFilterChange={setLastSolvedFilter}
                onSearchChange={setSearchQuery}
                onDurationChange={setSelectedDuration}
            />

            {/* Problems Table */}
            <div className="flex flex-col mt-3">
                <ProbelemTable
                    problems={filteredProblems}
                    solvedSet={solvedSet}
                    onToggleSolved={handleToggleSolved}
                />
            </div>
        </div>
    );
};

export default CompanyDashboard;
