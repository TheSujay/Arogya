import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Stethoscope,
  FileText,
  Mail,
  History,
  Settings,
  LogOut,
  Pin,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";
import { AppContext } from "../context/AppContext";

const mainMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/main" },
  { label: "Book", icon: CalendarCheck, path: "/main/book-appointment" },
  { label: "Doctors", icon: Stethoscope, path: "/main/mydoctors" },
  { label: "History", icon: History, path: "/main/my-appointments" },
  { label: "Reports", icon: FileText, path: "/main/reports" },
  { label: "Messages", icon: Mail, path: "/main/messages" },
];

const bottomMenu = [
  { label: "Settings", icon: Settings, path: "/main/settings" },
  { label: "Logout", icon: LogOut, path: "/main/logout" },
];

const Sidebar = ({ expanded, setExpanded }) => {
  const [pinned, setPinned] = useState(() => {
    const stored = localStorage.getItem("sidebar-pinned");
    return stored === null ? true : stored === "true";
  });

  const { setShowMobileMenu, showMobileMenu } = useContext(AppContext);
  const { setToken } = useContext(AppContext);
  const [activeIndex, setActiveIndex] = useState("/main");
  const timer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("sidebar-pinned", String(pinned));
  }, [pinned]);

  const handleMouseEnter = () => {
    if (!pinned) {
      clearTimeout(timer.current);
      setExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!pinned) {
      timer.current = setTimeout(() => setExpanded(false), 100);
    }
  };

  const togglePin = () => {
    const newPinned = !pinned;
    setPinned(newPinned);
    setExpanded(newPinned);
  };

  const handleNavigation = (item) => {
    setActiveIndex(item.path);
    setShowMobileMenu(false);

    if (item.label === "Logout") {
      localStorage.removeItem("token");
      setToken(false);
      navigate("/login");
    } else {
      navigate(item.path);
      scrollTo(0, 0);
    }
  };

  const renderMenuItems = (items) =>
    items.map((item) => (
      <div
        key={item.label}
        onClick={() => handleNavigation(item)}
        className={clsx(
          "group relative flex items-center rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer",
          activeIndex === item.path
            ? "bg-gradient-to-r from-[#74a9f0] to-white text-[#2e3192] font-semibold shadow-inner"
            : "text-[#7a7f9d] hover:bg-[#eaf2ff] hover:text-[#2e3192]"
        )}
      >
        <item.icon size={20} className="shrink-0" />
        <span
          className={clsx(
            "ml-3 text-sm font-medium whitespace-nowrap transition-opacity duration-300",
            expanded ? "opacity-100" : "opacity-0"
          )}
        >
          {item.label}
        </span>
      </div>
    ));

  return (
    <>
    {/* Background Behind Sidebar (Always Same Color) */}
<div
  className={clsx(
    "hidden md:block fixed top-0 left-0 h-full bg-theme  z-0 transition-all duration-300 ease-in-out",
    expanded ? "w-64" : "w-16"
  )}
/>

      {/* Desktop Sidebar */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={clsx(
          "hidden md:flex fixed top-4 left-0 md:left-4 z-40 h-[calc(100vh-2rem)] transition-all duration-300 ease-in-out shadow-2xl border border-gray-200 flex-col rounded-2xl overflow-hidden bg-theme text-themetext",
          expanded ? "w-64" : "w-16"
        )}
       
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2e3192] to-[#74a9f0] rounded-full shadow-md flex items-center justify-center text-white text-base font-bold font-debata ring-2 ring-white hover:scale-105 transition-transform duration-300">
              A
            </div>

            {expanded && (
              <span className="text-xl font-semibold text-[#2e3192]">
                AROGYA
              </span>
            )}
          </div>
          {expanded && (
            <button
              onClick={togglePin}
              className="text-[#2e3192] hover:text-[#74a9f0] transition"
            >
              <Pin className={clsx("w-4 h-4", pinned && "rotate-45")} />
            </button>
          )}
        </div>

        <nav className="flex flex-col px-2 py-4 space-y-1">
          {renderMenuItems(mainMenu)}
        </nav>

        <div className="mt-auto px-2 border-t border-gray-200 pt-4 pb-4">
          {renderMenuItems(bottomMenu)}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
        <div className="relative w-full h-20 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] pt-3 rounded-t-[30px]">
          {/* Notch Effect using clip-path */}
          <div className="absolute inset-0 bg-white z-0 rounded-t-[30px] clip-bottom-notch" />

          {/* FAB Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#2e3192] hover:bg-[#3b3ec1] text-white flex items-center justify-center shadow-xl z-10"
          >
            <Menu size={26} />
          </button>

          {/* Bottom Nav Items */}
          <div className="relative z-10 flex justify-between items-center px-10 h-full">
            {[mainMenu[0], mainMenu[1]].map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className={clsx(
                  "flex flex-col items-center text-sm",
                  activeIndex === item.path ? "text-[#2e3192]" : "text-gray-400"
                )}
              >
                <item.icon size={22} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            ))}
            <div className="w-16" /> {/* Spacer for FAB */}
            {[mainMenu[2], mainMenu[3]].map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className={clsx(
                  "flex flex-col items-center text-sm",
                  activeIndex === item.path ? "text-[#2e3192]" : "text-gray-400"
                )}
              >
                <item.icon size={22} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-end md:hidden">
          <div className="bg-white rounded-t-3xl w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#2e3192]">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[...mainMenu, ...bottomMenu]
                .filter(
                  (item) =>
                    !["Dashboard", "Book", "Doctors", "History"].includes(
                      item.label
                    )
                )
                .map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item)}
                    className="flex flex-col items-center justify-center p-2 text-gray-700 hover:text-[#2e3192] transition rounded-xl"
                  >
                    <item.icon size={24} />
                    <span className="text-xs mt-1">{item.label}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>

      )}
     
    </>
  );
};

export default Sidebar;
