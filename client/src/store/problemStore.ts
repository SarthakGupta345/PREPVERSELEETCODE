import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SolvedProblemDetails {
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    acceptance: number;
    frequency: number;
    companies: string[];
    topics: string[];
    link: string;
    solvedAt: string; // ISO string
}

interface ProblemState {
    solvedProblems: Record<string, SolvedProblemDetails>; // key is lowercase trimmed title
    toggleSolved: (problem: {
        title: string;
        difficulty: "Easy" | "Medium" | "Hard";
        acceptance: number;
        frequency: number;
        companies: string[];
        topics: string[];
        link: string;
    }) => void;
    clearSolved: () => void;
}

export const useProblemStore = create<ProblemState>()(
    persist(
        (set) => ({
            solvedProblems: {},
            toggleSolved: (problem) =>
                set((state) => {
                    const key = problem.title.toLowerCase().trim();
                    const nextSolved = { ...state.solvedProblems };
                    if (nextSolved[key]) {
                        delete nextSolved[key];
                    } else {
                        nextSolved[key] = {
                            ...problem,
                            solvedAt: new Date().toISOString(),
                        };
                    }
                    return { solvedProblems: nextSolved };
                }),
            clearSolved: () => set({ solvedProblems: {} }),
        }),
        {
            name: "prepverse-problems-storage",
        }
    )
);
