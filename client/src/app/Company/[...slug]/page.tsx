import { notFound } from "next/navigation";
import CompanyDashboard from "@/components/company/CompanyDashboard";
import type { CompanyData } from "@/constants/comapnyData";

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

async function getCompanyData(companyName: string): Promise<CompanyData | null> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7080";
        const res = await fetch(`${apiUrl}/companies/${encodeURIComponent(companyName)}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (json.success) return json.data;
        return null;
    } catch (err) {
        console.error("Error fetching company data:", err);
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