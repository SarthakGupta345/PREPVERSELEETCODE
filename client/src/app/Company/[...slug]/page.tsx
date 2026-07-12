import { notFound } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import CompanyDashboard from "@/components/company/CompanyDashboard";
import type { CompanyData } from "@/constants/comapnyData";

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

async function getCompanyData(companyName: string): Promise<CompanyData | null> {
    // Sanitize the company name into a valid filename
    const safeFilename = companyName.replace(/[\/\\?%*:|"<>]/g, "_");
    const filePath = path.join(
        process.cwd(),
        "src",
        "constants",
        "data",
        "companies",
        `${safeFilename}.json`
    );

    try {
        const raw = await fs.readFile(filePath, "utf-8");
        return JSON.parse(raw) as CompanyData;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const companyName = decodeURIComponent(slug.join(" "));
    return {
        title: `${companyName} Interview Questions | PrepVerse`,
        description: `Practice the most frequently asked ${companyName} coding interview questions. Filter by difficulty, duration, and topics.`,
    };
}

const CompanyPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    // Reconstruct company name from slug segments
    const companyName = decodeURIComponent(slug.join(" "));
    const companyData = await getCompanyData(companyName);

    if (!companyData) {
        notFound();
    }

    return (
        <div
            className="
                min-h-screen
                bg-neutral-50

                dark:bg-[#141414]
            "
        >
            {/* Container */}
            <div className="px-8 py-8">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-3">
                    <div>
                        <h1
                            className="
                                text-3xl font-bold tracking-tight
                                text-black

                                dark:text-white
                            "
                        >
                            {companyData.company} Interview Questions
                        </h1>

                        <p
                            className="
                                mt-2 max-w-2xl
                                text-sm leading-6
                                text-neutral-500
                            "
                        >
                            Track your interview preparation, monitor solved questions, and
                            explore the most frequently asked coding topics at{" "}
                            {companyData.company}.{" "}
                            <span className="font-semibold text-[#ffa116]">
                                {companyData.total_records_across_durations} problems
                            </span>{" "}
                            across {companyData.durations_available.length} time frames.
                        </p>
                    </div>
                </div>

                {/* Dashboard (client component) */}
                <CompanyDashboard companyData={companyData} />
            </div>
        </div>
    );
};

export default CompanyPage;