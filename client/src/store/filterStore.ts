import { create } from "zustand";

interface FilterState {
    searchQuery: string;
    activeTopic: string;
    difficultyFilter: string; // "All" | "Easy" | "Medium" | "Hard"
    solvedFilter: string; // "All" | "Solved" | "Unsolved"
    sortBy: "frequency" | "acceptance" | "difficulty";
    sortOrder: "asc" | "desc";
    currentPage: number;
    itemsPerPage: number;

    setSearchQuery: (query: string) => void;
    setActiveTopic: (topic: string) => void;
    setDifficultyFilter: (difficulty: string) => void;
    setSolvedFilter: (solved: string) => void;
    setSortBy: (sortBy: "frequency" | "acceptance" | "difficulty") => void;
    toggleSortOrder: () => void;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (limit: number) => void;
    resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    searchQuery: "",
    activeTopic: "",
    difficultyFilter: "All",
    solvedFilter: "All",
    sortBy: "frequency",
    sortOrder: "desc",
    currentPage: 1,
    itemsPerPage: 50,

    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
    setActiveTopic: (topic) => set((state) => ({ 
        activeTopic: state.activeTopic === topic ? "" : topic, // toggle
        currentPage: 1 
    })),
    setDifficultyFilter: (difficulty) => set({ difficultyFilter: difficulty, currentPage: 1 }),
    setSolvedFilter: (solved) => set({ solvedFilter: solved, currentPage: 1 }),
    setSortBy: (sortBy) => set((state) => {
        if (state.sortBy === sortBy) {
            return { sortOrder: state.sortOrder === "asc" ? "desc" : "asc", currentPage: 1 };
        }
        return { sortBy, sortOrder: "desc", currentPage: 1 };
    }),
    toggleSortOrder: () => set((state) => ({ sortOrder: state.sortOrder === "asc" ? "desc" : "asc", currentPage: 1 })),
    setCurrentPage: (page) => set({ currentPage: page }),
    setItemsPerPage: (limit) => set({ itemsPerPage: limit, currentPage: 1 }),
    resetFilters: () => set({
        searchQuery: "",
        activeTopic: "",
        difficultyFilter: "All",
        solvedFilter: "All",
        sortBy: "frequency",
        sortOrder: "desc",
        currentPage: 1,
    }),
}));
