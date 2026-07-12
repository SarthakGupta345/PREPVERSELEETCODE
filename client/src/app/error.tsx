"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

const ErrorPage = () => {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 dark:bg-[#141414]">

            {/* Background Glow */}
            <div className="absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-red-500/10 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-[#ffa116]/10 blur-3xl" />

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-xl rounded-[32px] border border-neutral-200 bg-white/80 p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:border-neutral-800 dark:bg-[#1a1a1a]/90">

                {/* Error Icon */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-red-500/10 text-red-500">
                    <AlertTriangle size={42} />
                </div>

                {/* Error Code */}
                <h1 className="mt-8 text-7xl font-black tracking-[-0.05em] text-neutral-900 dark:text-white">
                    404
                </h1>

                {/* Heading */}
                <h2 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="mx-auto mt-5 max-w-md text-[16px] leading-7 text-neutral-500">
                    The page you’re looking for doesn’t exist or may have been moved. Try going back to the dashboard or refresh the page.
                </p>

                {/* Buttons */}
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

                    {/* Back Button */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-all duration-200 hover:border-[#ffa116] hover:bg-[#fff7ed] hover:text-[#ffa116] dark:border-neutral-700 dark:bg-[#222] dark:text-neutral-300 dark:hover:bg-[#2a241c]"
                    >
                        <ArrowLeft size={18} />
                        Back Home
                    </Link>

                    {/* Retry Button */}
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 rounded-2xl bg-[#ffa116] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-500"
                    >
                        <RefreshCw size={18} />
                        Refresh Page
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-8 text-xs text-neutral-400">
                    PrepVerse • Smart Interview Preparation
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;