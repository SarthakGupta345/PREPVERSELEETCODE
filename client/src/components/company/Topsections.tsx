"use client";

import React from "react";
import {
    Search,
    ArrowUpAZ,
    Flame,
    ListOrdered,
    ChevronDown,
} from "lucide-react";

const Topsections = () => {
    return (
        <div
            className="
                mb-6 flex flex-col gap-4
                rounded-2xl
                border border-neutral-200
                bg-white
                p-5
                shadow-sm

                dark:border-neutral-800
                dark:bg-[#1a1a1a]
            "
        >
            {/* Top */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}
                <div>
                    <h2
                        className="
                            text-2xl font-bold
                            text-black
                            dark:text-white
                        "
                    >
                        Companies
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        Browse interview questions company-wise
                    </p>
                </div>

                {/* Search */}
                <div
                    className="
                        flex h-11 w-full items-center gap-3
                        rounded-xl
                        border border-neutral-300
                        bg-neutral-50
                        px-4

                        transition-all duration-200

                        focus-within:border-[#ffa116]
                        focus-within:bg-white

                        dark:border-neutral-700
                        dark:bg-[#222]

                        lg:w-[340px]
                    "
                >
                    <Search
                        size={18}
                        className="text-neutral-500"
                    />

                    <input
                        type="text"
                        placeholder="Search companies..."
                        className="
                            w-full bg-transparent
                            text-sm outline-none

                            placeholder:text-neutral-500

                            dark:text-white
                        "
                    />
                </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-wrap items-center gap-3">

                {/* Sort Label */}
                <div className="flex items-center gap-2">
                    <span
                        className="
                            text-sm font-medium
                            text-neutral-500
                        "
                    >
                        Sort by:
                    </span>
                </div>

                {/* Alphabetical */}
                <button
                    className="
                        flex items-center gap-2

                        rounded-lg
                        border border-neutral-300
                        bg-neutral-50

                        px-4 py-2

                        text-sm font-medium
                        text-neutral-700

                        transition-all duration-200

                        hover:border-[#ffa116]
                        hover:bg-[#fff7ed]
                        hover:text-[#ffa116]

                        dark:border-neutral-700
                        dark:bg-[#222]
                        dark:text-neutral-300

                        dark:hover:border-[#ffa116]
                        dark:hover:bg-[#2a241c]
                    "
                >
                    <ArrowUpAZ size={16} />

                    Alphabetical

                    <ChevronDown size={15} />
                </button>

                {/* Most Frequent */}
                <button
                    className="
                        flex items-center gap-2

                        rounded-lg
                        border border-neutral-300
                        bg-neutral-50

                        px-4 py-2

                        text-sm font-medium
                        text-neutral-700

                        transition-all duration-200

                        hover:border-[#ffa116]
                        hover:bg-[#fff7ed]
                        hover:text-[#ffa116]

                        dark:border-neutral-700
                        dark:bg-[#222]
                        dark:text-neutral-300

                        dark:hover:border-[#ffa116]
                        dark:hover:bg-[#2a241c]
                    "
                >
                    <Flame size={16} />

                    Most Frequent

                    <ChevronDown size={15} />
                </button>

                {/* Total Questions */}
                <button
                    className="
                        flex items-center gap-2

                        rounded-lg
                        border border-neutral-300
                        bg-neutral-50

                        px-4 py-2

                        text-sm font-medium
                        text-neutral-700

                        transition-all duration-200

                        hover:border-[#ffa116]
                        hover:bg-[#fff7ed]
                        hover:text-[#ffa116]

                        dark:border-neutral-700
                        dark:bg-[#222]
                        dark:text-neutral-300

                        dark:hover:border-[#ffa116]
                        dark:hover:bg-[#2a241c]
                    "
                >
                    <ListOrdered size={16} />

                    Total Questions

                    <ChevronDown size={15} />
                </button>
            </div>
        </div>
    );
};

export default Topsections;