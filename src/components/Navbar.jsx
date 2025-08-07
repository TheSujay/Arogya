import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between py-4 mb-5 border-b border-gray-200 shadow-sm px-4 sm:px-10 bg-white z-30">
      {/* Logo */}
      <img
        onClick={() => navigate(token ? "/main" : "/")}
        className="w-36 sm:w-44 cursor-pointer transition-opacity hover:opacity-80"
        src={assets.logo}
        alt="Logo"
      />

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-6 font-medium text-gray-700">
        <li
          onClick={() => navigate(token ? "/main" : "/")}
          className="cursor-pointer hover:text-primary transition"
        >
          HOME
        </li>
        <li
          onClick={() => navigate("/doctors")}
          className="cursor-pointer hover:text-primary transition"
        >
          ALL DOCTORS
        </li>
        <li
          onClick={() => navigate("/about")}
          className="cursor-pointer hover:text-primary transition"
        >
          ABOUT
        </li>
        <li
          onClick={() => navigate("/contact")}
          className="cursor-pointer hover:text-primary transition"
        >
          CONTACT
        </li>
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 object-cover rounded-full border border-gray-300"
                src={userData.image}
                alt="User"
              />
              <img
                className="w-3 transition-transform group-hover:rotate-180"
                src={assets.dropdown_icon}
                alt="Dropdown"
              />
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 bg-white rounded shadow-lg py-2 px-4 w-48 hidden group-hover:block z-20">
              <p
                onClick={() => navigate("/my-profile")}
                className="py-1 text-gray-700 hover:text-primary transition cursor-pointer"
              >
                My Profile
              </p>
              <p
                onClick={() => navigate("/my-appointments")}
                className="py-1 text-gray-700 hover:text-primary transition cursor-pointer"
              >
                My Appointments
              </p>
              <p
                onClick={logout}
                className="py-1 text-gray-700 hover:text-primary transition cursor-pointer"
              >
                Logout
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden md:block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full text-sm font-medium transition"
          >
            Create account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 h-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <img src={assets.logo} className="w-32" alt="Logo" />
          <img
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            className="w-6 cursor-pointer"
            alt="Close"
          />
        </div>

        <ul className="flex flex-col gap-4 p-6 font-medium text-gray-700">
          <li
            onClick={() => {
              setShowMenu(false);
              navigate(token ? "/main" : "/");
            }}
            className="hover:text-primary cursor-pointer"
          >
            HOME
          </li>
          <li
            onClick={() => {
              setShowMenu(false);
              navigate("/doctors");
            }}
            className="hover:text-primary cursor-pointer"
          >
            ALL DOCTORS
          </li>
          <li
            onClick={() => {
              setShowMenu(false);
              navigate("/about");
            }}
            className="hover:text-primary cursor-pointer"
          >
            ABOUT
          </li>
          <li
            onClick={() => {
              setShowMenu(false);
              navigate("/contact");
            }}
            className="hover:text-primary cursor-pointer"
          >
            CONTACT
          </li>
          {!token && (
            <button
              onClick={() => {
                setShowMenu(false);
                navigate("/login");
              }}
              className="mt-4 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-full text-sm font-medium transition"
            >
              Create account
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
