import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ChatBot from "./Chatbot";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const stored = localStorage.getItem("sidebar-pinned");
    return stored === null ? true : stored === "true";
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // NEW STATE

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowMobileMenu(false); // Hide mobile menu on resize to desktop
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const layoutOffset = isMobile ? "0rem" : sidebarExpanded ? "17rem" : "5rem";

  return (
    <div className="flex  text-gray-900 h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-20 transition-all duration-300">
        <Sidebar
          expanded={sidebarExpanded}
          setExpanded={setSidebarExpanded}
          isMobile={isMobile}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
      </div>

      {/* Main Content */}
      <div
  className="flex flex-col flex-1 transition-all duration-300"
  style={{ marginLeft: layoutOffset }}
>

        {/* Topbar */}
       <div className="sticky top-0 z-20">

          <Topbar />
        </div>

        {/* Chatbot */}
        <ChatBot showMobileMenu={showMobileMenu} />

        {/* Main Content */}
        <main
          className="flex-1 overflow-y-auto bg-[#f6faff] z-10"
          style={{ paddingBottom: isMobile ? "6rem" : "2rem" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
