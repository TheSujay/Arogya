// AppContext.js
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );
  const [loading, setLoading] = useState(true); // ✅ new state
  const [authChecked, setAuthChecked] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // ← NEW


  // ✅ THEME COLOR STATE
  const [themeColor, setThemeColor] = useState(
    localStorage.getItem("themeColor") || "#2e3192"
  );

  // ✅ APPLY THEME VARIABLES
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--theme-color", themeColor);
    root.style.setProperty("--text-color", getContrastYIQ(themeColor));
    localStorage.setItem("themeColor", themeColor);
  }, [themeColor]);

  // ✅ YIQ CONTRAST CHECKER
  const getContrastYIQ = (hex) => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
  };

useEffect(() => {
  if (!token) {
    localStorage.removeItem("userData"); // 🧹 Clear userData if no token
    setUserData(null);
  }
  setAuthChecked(true); // Done checking
}, [token]);



  const getDoctosData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUserData(data.userData);
        localStorage.setItem("userData", JSON.stringify(data.userData));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    getDoctosData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setLoading(false); // ✅ no token, but done loading
    }
  }, [token]);

  const logout = () => {
    setToken("");
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully");
  };

  return (
    <AppContext.Provider
      value={{
        doctors,
        getDoctosData,
        currencySymbol,
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        loadUserProfileData,
        logout,
        loading, // ✅ added
        setLoading, // ✅ added
        authChecked, // ✅ added to indicate auth check is done
        themeColor,       // ✅ provide themeColor
        setThemeColor,    // ✅ provide setter
        showMobileMenu,        // ← NEW
        setShowMobileMenu,     // ← NEW
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
