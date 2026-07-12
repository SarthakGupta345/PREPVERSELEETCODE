"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    Building2,
    ChevronRight,
    ArrowDownAZ,
    ArrowUpAZ,
} from "lucide-react";
import companiesIndex from "@/constants/data/companiesIndex.json";
import type { CompanyIndex } from "@/constants/comapnyData";

const typedCompanies = companiesIndex as CompanyIndex[];

/* ---------------- Component ---------------- */

const SearchSection = () => {
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const filteredCompanies = useMemo(() => {
        const filtered = typedCompanies.filter((company) =>
            company.name.toLowerCase().includes(search.toLowerCase())
        );

        return filtered.sort((a, b) => {
            if (sortOrder === "asc") {
                return a.name.localeCompare(b.name);
            }
            return b.name.localeCompare(a.name);
        });
    }, [search, sortOrder]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

            {/* Left Sidebar */}
            <div
                className="
                    overflow-hidden rounded-2xl
                    border border-neutral-200
                    bg-white

                    dark:border-neutral-800
                    dark:bg-[#1a1a1a]

                    lg:col-span-3
                "
            >
                {/* Header */}
                <div
                    className="
                        border-b border-neutral-200
                        px-5 py-4

                        dark:border-neutral-800
                    "
                >
                    <div className="flex items-center justify-between">

                        <div>
                            <h2
                                className="
                                    text-lg font-semibold
                                    text-black

                                    dark:text-white
                                "
                            >
                                Companies
                            </h2>

                            <p className="mt-1 text-sm text-neutral-500">
                                {typedCompanies.length} companies · Browse alphabetically
                            </p>
                        </div>

                        {/* Sort Button */}
                        <button
                            onClick={() =>
                                setSortOrder((prev) =>
                                    prev === "asc" ? "desc" : "asc"
                                )
                            }
                            className="
                                flex h-10 w-10 items-center
                                justify-center

                                rounded-xl

                                border border-neutral-300
                                bg-neutral-50

                                text-neutral-600

                                transition-all duration-200

                                hover:border-[#ffa116]
                                hover:bg-[#fff7ed]
                                hover:text-[#ffa116]

                                dark:border-neutral-700
                                dark:bg-[#222]
                                dark:text-neutral-300
                                dark:hover:bg-[#2a241c]
                            "
                        >
                            {sortOrder === "asc" ? (
                                <ArrowDownAZ size={18} />
                            ) : (
                                <ArrowUpAZ size={18} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Company List */}
                <div
                    className="
                        flex max-h-[700px]
                        flex-col overflow-y-auto
                    "
                >
                    {filteredCompanies.map(
                        (company, index) => (
                            <Link
                                key={index}
                                href={`/Company/${encodeURIComponent(company.name)}`}
                                className="
                                    group

                                    flex items-center
                                    justify-between

                                    border-b border-neutral-100

                                    px-5 py-3

                                    text-left

                                    transition-all duration-200

                                    hover:bg-[#fff7ed]

                                    dark:border-neutral-800
                                    dark:hover:bg-[#2a241c]
                                "
                            >
                                <span
                                    className="
                                        text-sm font-medium
                                        text-neutral-700

                                        transition-colors duration-200

                                        group-hover:text-[#ffa116]

                                        dark:text-neutral-300
                                    "
                                >
                                    {company.name}
                                </span>

                                <ChevronRight
                                    size={16}
                                    className="
                                        text-neutral-400

                                        transition-transform duration-200

                                        group-hover:translate-x-1
                                        group-hover:text-[#ffa116]
                                    "
                                />
                            </Link>
                        )
                    )}
                </div>
            </div>

            {/* Right Section */}
            <div className="lg:col-span-9">

                {/* Search */}
                <div
                    className="
                        mb-6 flex h-12 items-center gap-3

                        rounded-2xl
                        border border-neutral-200
                        bg-white

                        px-4

                        shadow-sm

                        transition-all duration-200

                        focus-within:border-[#ffa116]

                        dark:border-neutral-800
                        dark:bg-[#1a1a1a]
                    "
                >
                    <Search
                        size={18}
                        className="text-neutral-500"
                    />

                    <input
                        type="text"
                        placeholder={`Search ${typedCompanies.length} companies...`}
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full bg-transparent
                            text-sm outline-none

                            placeholder:text-neutral-500

                            dark:text-white
                        "
                    />

                    {search && (
                        <span className="text-xs text-neutral-400">
                            {filteredCompanies.length} results
                        </span>
                    )}
                </div>

                {/* Cards */}
                <div
                    className="
                        grid grid-cols-1 gap-5
                        md:grid-cols-2
                        xl:grid-cols-3
                    "
                >
                    {filteredCompanies.map(
                        (company, index) => (
                            <Link
                                key={index}
                                href={`/Company/${encodeURIComponent(company.name)}`}
                                className="
                                    group relative overflow-hidden

                                    rounded-2xl
                                    border border-neutral-200
                                    bg-white

                                    p-5

                                    text-left

                                    shadow-sm

                                    transition-all duration-300

                                    hover:-translate-y-1
                                    hover:border-[#ffa116]
                                    hover:shadow-lg

                                    dark:border-neutral-800
                                    dark:bg-[#1a1a1a]
                                "
                            >
                                {/* Hover Glow */}
                                <div
                                    className="
                                        absolute inset-0
                                        opacity-0

                                        transition-opacity duration-300

                                        group-hover:opacity-100

                                        bg-gradient-to-br
                                        from-[#ffa116]/5
                                        to-transparent
                                    "
                                />

                                {/* Content */}
                                <div className="relative z-10">

                                    {/* Icon */}
                                    <div
                                        className="
                                            mb-5 flex h-12 w-12
                                            items-center justify-center

                                            rounded-xl

                                            bg-[#ffa116]/10

                                            text-[#ffa116]

                                            transition-all duration-300

                                            group-hover:scale-110
                                            group-hover:bg-[#ffa116]
                                            group-hover:text-white
                                        "
                                    >
                                        <Building2 size={22} />
                                    </div>

                                    {/* Name */}
                                    <h3
                                        className="
                                            text-lg font-semibold
                                            text-black

                                            transition-colors duration-200

                                            group-hover:text-[#ffa116]

                                            dark:text-white
                                        "
                                    >
                                        {company.name}
                                    </h3>

                                    {/* Problems */}
                                    <div className="mt-5">
                                        <p className="text-sm text-neutral-500">
                                            Total Problems
                                        </p>

                                        <h2
                                            className="
                                                mt-1 text-3xl font-bold
                                                text-black

                                                dark:text-white
                                            "
                                        >
                                            {company.problems}
                                        </h2>
                                    </div>
                                </div>
                            </Link>
                        )
                    )}
                </div>

                {/* Empty State */}
                {filteredCompanies.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                        <Building2 size={48} className="mb-4 opacity-30" />
                        <p className="text-lg font-medium">No companies found</p>
                        <p className="mt-1 text-sm">Try a different search term</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchSection;