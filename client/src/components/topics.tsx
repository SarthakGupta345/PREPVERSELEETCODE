"use client";

import React from "react";
import globalTopics from "@/constants/data/globalTopics.json";
import type { GlobalTopic } from "@/constants/problemData";
import { useFilterStore } from "@/store/filterStore";

const topics = (globalTopics as GlobalTopic[]).slice(0, 20); // Show top 20 topics

const TopicsSection = () => {
    const { activeTopic, setActiveTopic } = useFilterStore();

    return (
        <section
            className="
                border-b border-t rounded-t-md border-neutral-200
                bg-white
                py-5 px-7

                dark:border-neutral-800
                dark:bg-[#1a1a1a]
            "
        >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Topics
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        {globalTopics.length} unique topics across {" "}
                        <span className="font-medium text-[#ffa116]">470 companies</span>
                    </p>
                </div>

                {activeTopic && (
                    <button
                        onClick={() => setActiveTopic("")}
                        className="
                            text-sm font-semibold
                            text-[#ffa116]
                            transition hover:opacity-80
                        "
                    >
                        Clear Selection
                    </button>
                )}
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2.5">
                {topics.map((topic, index) => {
                    const isActive = activeTopic.toLowerCase().trim() === topic.name.toLowerCase().trim();

                    return (
                        <button
                            key={index}
                            onClick={() => setActiveTopic(topic.name)}
                            className={`
                                group
                                flex items-center gap-2
                                rounded-lg
                                border px-3 py-2
                                transition-all duration-200
                                hover:border-[#ffa116]
                                hover:bg-[#fff7ed]
                                dark:hover:bg-[#2a241c]
                                
                                ${isActive
                                    ? "border-[#ffa116] bg-[#fff7ed] dark:bg-[#2a241c]"
                                    : "border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-[#222]"
                                }
                            `}
                        >
                            {/* Topic Name */}
                            <span
                                className={`
                                    text-sm font-medium transition-colors duration-200
                                    group-hover:text-[#ffa116]
                                    
                                    ${isActive
                                        ? "text-[#ffa116]"
                                        : "text-neutral-700 dark:text-neutral-300"
                                    }
                                `}
                            >
                                {topic.name}
                            </span>

                            {/* Count */}
                            <span
                                className={`
                                    rounded-md px-1.5 py-0.5 text-[11px] font-semibold transition-all duration-200
                                    group-hover:bg-[#ffa116] group-hover:text-white
                                    
                                    ${isActive
                                        ? "bg-[#ffa116] text-white"
                                        : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                                    }
                                `}
                            >
                                {topic.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default TopicsSection;