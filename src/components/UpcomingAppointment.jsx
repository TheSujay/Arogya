import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

// Skeleton loader
const SkeletonCard = () => (
  <div className="animate-pulse bg-white p-5 rounded-2xl border-l-4 border-blue-200 shadow-md">
    <div className="h-4 w-1/3 bg-gray-200 mb-2 rounded" />
    <div className="h-4 w-1/4 bg-gray-200 mb-2 rounded" />
    <div className="h-5 w-2/3 bg-gray-300 mb-2 rounded" />
    <div className="h-4 w-1/3 bg-gray-200 mb-2 rounded" />
    <div className="h-4 w-1/2 bg-gray-200 mb-2 rounded" />
    <div className="h-8 w-24 bg-gray-300 rounded mt-2" />
  </div>
);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatDate = (slotDate) => {
  const [day, month, year] = slotDate.split("_");
  return `${months[parseInt(month) - 1]} ${day}, ${year}`;
};

const parseDateTime = (slotDate, slotTime) => {
  try {
    const [day, month, year] = slotDate.split("_").map(Number);
    const timeStr = slotTime.includes("-")
      ? slotTime.split(" - ")[0].trim()
      : slotTime.trim();

    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes);
  } catch (error) {
    console.error("❌ Failed to parse slotDate or slotTime:", slotDate, slotTime);
    return new Date(0);
  }
};

export default function UpcomingAppointments() {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Raw fetched appointments:", data.appointments);

      const now = new Date();

const upcoming = data.appointments
  .filter((appt) => {
    const apptTime = parseDateTime(appt.slotDate, appt.slotTime);

    const isUpcoming =
      !appt.cancelled &&
      !appt.isCompleted &&
      apptTime >= now; // ✅ Fix: includes same-day future times

    console.log(
      "🕒 Checking:",
      appt.slotDate,
      appt.slotTime,
      "→",
      apptTime,
      "| Upcoming:",
      isUpcoming
    );
    return isUpcoming;
  })
  .sort((a, b) => parseDateTime(a.slotDate, a.slotTime) - parseDateTime(b.slotDate, b.slotTime))
  .slice(0, 2);


      console.log("✅ Filtered upcoming:", upcoming);
      

      setAppointments(upcoming);
    } catch (error) {
      toast.error("Failed to fetch upcoming appointments.");
      console.error("❌ Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  return (
    <div className="rounded-3xl p-6" style={{ backgroundColor: "#f6faff", boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)" }}>
      <h3 className="text-2xl font-bold mb-6" style={{ color: "#090a29" }}>
        📅 Upcoming Appointments
      </h3>

      <div className="flex flex-col gap-5">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt._id}
              className="rounded-2xl p-5 transition cursor-pointer"
              style={{ backgroundColor: "#fff", borderLeft: "4px solid #2e3192", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
              onClick={() => navigate(`/main/appointment/${appt._id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium flex items-center gap-2" style={{ color: "#2e3192" }}>
                  <CalendarMonthIcon fontSize="small" />
                  {formatDate(appt.slotDate)}
                </div>
                <MoreVertIcon className="cursor-pointer" style={{ color: "#b0b3c7" }} />
              </div>

              <div className="flex items-center text-sm gap-2 mb-1" style={{ color: "#6c7280" }}>
                <AccessTimeIcon fontSize="small" />
                {appt.slotTime}
              </div>

              <div className="font-semibold text-lg" style={{ color: "#090a29" }}>
                {appt.docData?.name}
              </div>
              <div className="text-sm font-medium" style={{ color: "#2e3192" }}>
                {appt.docData?.speciality}
              </div>

              <div className="flex items-center text-sm gap-2 mt-1" style={{ color: "#7a7f9d" }}>
                <PlaceIcon fontSize="small" />
                {appt.userData?.address?.line1 || "Clinic Address"}
              </div>

              <button
                className="mt-3 text-sm font-semibold px-3 py-1 rounded transition"
                style={{ color: "#2e3192", backgroundColor: "#f6faff", border: "1px solid #2e3192" }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/main/my-appointments/${appt._id}`);
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#74a9f0";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#f6faff";
                  e.currentTarget.style.color = "#2e3192";
                }}
              >
                View details...
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
