import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";

const Reports = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [reports, setReports] = useState([]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split("_");
    return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
  };

  const getReports = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(data.appointments)) {
        const filtered = data.appointments.filter(a => a.reportUrl);
        setReports(filtered.reverse());
      } else {
        toast.info("No reports available.");
      }
    } catch (error) {
      toast.error("Failed to fetch reports.");
    }
  };

  useEffect(() => {
    if (token) getReports();
  }, [token]);

  return (
    <div className="min-h-screen px-4 pt-20 pb-10 rounded-lg bg-gray-50 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">All Reports</h1>

        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search by name or ID"
            className="w-full border px-4 py-2 rounded shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-gray-500 text-center">No reports found.</p>
        ) : (
          reports.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-xl shadow px-4 py-4 gap-4"
            >
              {/* Index */}
              <div className="text-gray-600 text-sm font-medium md:w-6">
                #{index + 1}
              </div>

              {/* Doctor Info */}
              <div className="flex items-center gap-3 md:w-1/4">
                <img
                  src={item.docData?.image || "/doctor-placeholder.png"}
                  alt={item.docData?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800 text-sm">{item.docData?.name}</p>
                  <p className="text-gray-600 text-xs">{item.docData?.speciality}</p>
                </div>
              </div>

              {/* Payment Method */}
              <span
                className="text-xs px-2 py-1 rounded-full font-medium text-white w-max"
                style={{
                  backgroundColor:
                    item.paymentMethod === "cash"
                      ? "#eab308"
                      : item.paymentMethod === "online"
                      ? "#22c55e"
                      : "#ef4444",
                }}
              >
                {item.paymentMethod ? item.paymentMethod.toUpperCase() : "INVALID"}
              </span>

              {/* Date and Time */}
              <span className="text-sm text-gray-800">
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </span>

              {/* Report Link */}
              <a
                href={item.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="text-blue-600 hover:text-blue-800 transition self-start md:self-center"
              >
                <Eye className="w-5 h-5" />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;
