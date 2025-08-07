import React from "react";
import { DashboardHeader } from "../components/ui/dashboard-header.jsx";
import UpcomingAppointment from "../components/UpcomingAppointment.jsx";
import QuickAction from "../components/QuickAction.jsx";
import SymptomChecker from "../components/SymptomChecker.jsx";
import AnnouncementSection from "../components/AnnouncementSection.jsx";
import FeaturesSection from "../components/FeatureSection.jsx";


export default function DashboardPage() {
  const user = { name: "Sujay" };

  return (
    <div className="min-h-screen px-4 pt-20 pb-10 bg-theme text-themetext transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Two-Column Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            <DashboardHeader userName={user.name} />
            <SymptomChecker />
           
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-96 flex flex-col gap-6">
            <UpcomingAppointment />
            <QuickAction />
          </div>
        </div>

        {/* Announcement + Features */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
            <AnnouncementSection />
          </div>
          <div className="w-full lg:w-1/2">
            <FeaturesSection />
          </div>
        </div>
      </div>
    </div>
  );
}
