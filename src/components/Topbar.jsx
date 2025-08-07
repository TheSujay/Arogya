import React, { useContext, useState } from "react";
import { Bell, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// 💡 Inline function to check if a color is light
const isLightColor = (hex) => {
  if (!hex || !hex.startsWith("#")) return false;
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186;
};

const themeOptions = [
  "#2e3192", "#f3b529", "#38bdf8", "#34d399",
  "#ef4444", "#9333ea", "#000000", "#ffffff",
];

const Topbar = () => {
  const { userData, themeColor, setThemeColor } = useContext(AppContext);
  const [hover, setHover] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const iconColor = isLightColor(themeColor) ? "#1F2937" : themeColor;

  return (
    <div className="fixed top-4 right-4 z-40 bg-theme text-themetext rounded-full shadow-md px-4 py-2 flex items-center gap-4">
      {/* 🌞 Theme Switch */}
      <div className="relative">
        <button
          onClick={() => setShowPalette(!showPalette)}
          title="Change Theme"
          className="flex items-center gap-1 px-2 h-9 bg-[#f6faff] hover:bg-gray-100 rounded-full shadow-sm"
        >
          <Sun size={18} style={{ color: iconColor }} />
          <span
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: themeColor }}
          />
        </button>

        {showPalette && (
          <div className="absolute right-0 mt-2 p-2 bg-white rounded-xl shadow-lg grid grid-cols-4 gap-2 z-50">
            {themeOptions.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setThemeColor(color);
                  setShowPalette(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 🔔 Notification */}
      <button className="w-9 h-9 flex items-center justify-center bg-[#f6faff] hover:bg-gray-100 rounded-full shadow-sm relative">
        <Bell size={18} style={{ color: iconColor }} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* 👤 Profile */}
      <div
        className="relative group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Link to="/main/settings">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--theme-color)] shadow-sm">
            <img
              src={userData?.image || "https://via.placeholder.com/150"}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {hover && userData && (
          <div className="absolute top-12 right-0 w-64 px-4 py-3 bg-white text-sm rounded-xl shadow-lg z-50 border border-gray-200 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={userData.image}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <div>
                <p className="font-semibold text-gray-800">{userData.name}</p>
                <p className="text-xs text-gray-500">{userData.email}</p>
              </div>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Role: {userData.role || "User"}</p>
              <p>DOB: {userData.dob}</p>
              <p>Phone: {userData.phone}</p>
              <p>Joined: {new Date(userData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
