import Header from "@/components/common/header";
import FilterSection from "@/components/filterSection";
import ProblemCard from "@/components/problems";
import TopicsSection from "@/components/topics";
import React from "react";


const MainPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a] px-2 ">
      <TopicsSection/>
      <FilterSection/>
       <ProblemCard />
    </div>
  );
};

export default MainPage;