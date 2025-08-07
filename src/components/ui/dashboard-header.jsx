"use client";

import React, { useContext } from "react";
import Doctor from "../../assets/Doctor.gif";
import { AppContext } from "../../context/AppContext";

export const DashboardHeader = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="relative bg-white shadow-md rounded-3xl px-6 md:px-10 py-8 flex flex-col md:flex-row justify-between items-center overflow-visible h-[300px]">
      {/* Left Greeting */}
      <div className="z-10 w-full md:w-1/2 space-y-4 text-left">
        <h2 className="text-2xl font-semibold text-[#2e3192]">
          Hello, <span className="text-[#f3b529]">{userData?.name || "Guest"}</span>
        </h2>
        <p className="text-sm text-gray-500 max-w-md">
          Have a nice day and don’t forget to take care of your health!
        </p>
        <a
          href="#"
          className="inline-flex items-center text-sm font-medium text-[#2e3192] hover:text-[#090a29] transition"
        >
          Read more
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Right Image */}
      <div className="absolute right-0 bottom-0 md:-right-8 md:-bottom-4 w-[160px] md:w-[220px] lg:w-[260px] z-0 pointer-events-none">
        <img
          src={Doctor}
          alt="Doctor"
          className="w-full h-auto object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};
