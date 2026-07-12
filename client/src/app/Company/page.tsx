import CompanyHero from "@/components/company/HerSection";
import SearchSection from "@/components/company/searchSection";

const CompanyMainPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#141414]">
      <div className="px-5 py-8 ">
        <CompanyHero />
        <div className="mt-8">
          <SearchSection />
        </div>
      </div>
    </div>
  );
};

export default CompanyMainPage;