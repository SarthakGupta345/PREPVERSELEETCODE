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

    // Create a Set of titles solved from global solvedProblems store
    const solvedSet = useMemo(() => {
        if (!isMounted) return new Set<string>();
        return new Set(
            Object.values(solvedProblems).map((p: any) => p.title)
        );
    }, [solvedProblems, isMounted]);

    const [selectedDuration, setSelectedDuration] = useState("All");
    const [frequencyOrder, setFrequencyOrder] = useState<"asc" | "desc">("desc");
    const [difficultyFilter, setDifficultyFilter] = useState<string>("");
    const [lastSolvedFilter, setLastSolvedFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTopic, setActiveTopic] = useState("");

    // Get the active duration's records
    const activeDuration = useMemo(
        () => resolveDuration(companyData, selectedDuration),
        [companyData, selectedDuration]
    );

    const allRecords: ProblemRecord[] = useMemo(
        () => activeDuration?.records ?? [],
        [activeDuration]
    );

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
        (title: string) => {
            const problem = allRecords.find((r) => r.Title === title);
            if (!problem) return;

            const difficulty = normalizeDifficulty(problem.Difficulty);
            const acceptance = problem["Acceptance Rate"] <= 1 ? problem["Acceptance Rate"] * 100 : problem["Acceptance Rate"];
            const frequency = problem.Frequency ?? 0;
            const topicsList = problem.Topics ? problem.Topics.split(",").map(t => t.trim()).filter(Boolean) : [];

            toggleSolved({
                title: problem.Title,
                difficulty,
                acceptance,
                frequency,
                companies: [companyName],
                topics: topicsList,
                link: problem.Link || "#",
            });
        },
        [allRecords, companyName, toggleSolved]
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
