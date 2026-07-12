"use client";

import React from "react";

interface Topic {
    name: string;
    count: number;
}

interface PopularTopicsProps {
    topics?: Topic[];
    companyName?: string;
    activeTopic?: string;
    onTopicClick?: (topic: string) => void;
}

const PopularTopics = ({
    topics = [],
    companyName = "Company",
    activeTopic,
    onTopicClick,
}: PopularTopicsProps) => {
    return (
        <section
            className="
                rounded-xl
                border border-neutral-200
                bg-white
                p-5

                dark:border-neutral-800
                dark:bg-[#1a1a1a]
            "
        >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Popular Topics in {companyName}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        {topics.length} unique topics · Click to filter problems
                    </p>
                </div>

                {activeTopic && (
                    <button
                        onClick={() => onTopicClick?.("")}
                        className="text-xs text-[#ffa116] hover:underline"
                    >
                        Clear filter
                    </button>
                )}
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto">
                {topics.map((topic, index) => (
                    <button
                        key={index}
                        onClick={() =>
                            onTopicClick?.(
                                activeTopic === topic.name ? "" : topic.name
                            )
                        }
                        className={`
                            group
                            flex items-center gap-2

                            rounded-lg
                            border

                            px-3 py-2

                            transition-all duration-200

                            ${activeTopic === topic.name
                                ? "border-[#ffa116] bg-[#fff7ed] text-[#ffa116] dark:bg-[#2a241c]"
                                : "border-neutral-300 bg-neutral-50 hover:border-[#ffa116] hover:bg-[#fff7ed] dark:border-neutral-700 dark:bg-[#222] dark:hover:border-[#ffa116] dark:hover:bg-[#2a241c]"
                            }
                        `}
                    >
                        {/* Topic Name */}
                        <span
                            className={`
                                text-sm font-medium

                                transition-colors duration-200

                                ${activeTopic === topic.name
                                    ? "text-[#ffa116]"
                                    : "text-neutral-700 group-hover:text-[#ffa116] dark:text-neutral-300 dark:group-hover:text-[#ffa116]"
                                }
                            `}
                        >
                            {topic.name}
                        </span>

                        {/* Count */}
                        <span
                            className={`
                                rounded-md
                                px-1.5 py-0.5

                                text-[11px]
                                font-semibold

                                transition-all duration-200

                                ${activeTopic === topic.name
                                    ? "bg-[#ffa116] text-white"
                                    : "bg-neutral-200 text-neutral-600 group-hover:bg-[#ffa116] group-hover:text-white dark:bg-neutral-800 dark:text-neutral-400"
                                }
                            `}
                        >
                            {topic.count}
                        </span>
                    </button>
                ))}
            </div>

            {topics.length === 0 && (
                <p className="text-sm text-neutral-400">
                    No topics data available.
                </p>
            )}
        </section>
    );
};

export default PopularTopics;