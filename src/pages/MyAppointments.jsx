import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split("_");
    return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(data.appointments)) {
        setAppointments([...data.appointments].reverse());
      } else {
        toast.warn("No appointments found.");
        setAppointments([]);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch appointments.");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!appointmentId) return toast.error("Invalid appointment ID");
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      getUserAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel request failed.");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            getUserAppointments();
            navigate("/main/my-appointments");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      data.success ? initPay(data.order) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-stripe`,
        { appointmentId },
        { headers: { token } }
      );
      data.success
        ? window.location.replace(data.session_url)
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div className="min-h-screen pt-20 px-4 py-8 md:px-6 md:py-10 bg-theme text-themetext transition-colors duration-300">
      <div className="mb-6 md:text-left">
        <h1 className="text-xl sm:text-2xl font-semibold">My Appointments</h1>
        <p className="text-sm text-gray-400">Track and manage your appointments</p>
      </div>

      <div className="bg-white text-gray-700 shadow-lg rounded-xl p-4 sm:p-6">
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {appointments.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b pb-6"
              >
                {/* Doctor Image */}
                <img
                  src={item.docData.image || "/doctor-placeholder.png"}
                  alt={item.docData.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-gray-100"
                />

                {/* Info Section */}
                <div className="flex-1 text-sm space-y-1">
                  <p className="text-base sm:text-lg font-semibold text-gray-800">{item.docData.name}</p>
                  <p className="text-gray-600">{item.docData.speciality}</p>
                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <p>
                      <span className="font-medium text-gray-700">Address:</span>{" "}
                      {item.docData?.address?.line1}
                    </p>
                    <p>{item.docData?.address?.line2}</p>
                    <p>
                      <span className="font-medium text-gray-700">Date & Time:</span>{" "}
                      {slotDateFormat(item.slotDate)} | {item.slotTime}
                    </p>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-col gap-2 text-sm sm:items-end">
                  {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                    <button
                      onClick={() => setPayment(item._id)}
                      className="border px-3 py-1 rounded hover:bg-primary hover:text-white transition"
                    >
                      Pay Online
                    </button>
                  )}

                  {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                    <div className="flex flex-col gap-2 sm:items-end">
                      <button
                        onClick={() => appointmentStripe(item._id)}
                        className="border px-3 py-1 rounded hover:bg-gray-100 flex items-center justify-center"
                      >
                        <img src={assets.stripe_logo} alt="Stripe" className="h-5" />
                      </button>
                      <button
                        onClick={() => appointmentRazorpay(item._id)}
                        className="border px-3 py-1 rounded hover:bg-gray-100 flex items-center justify-center"
                      >
                        <img src={assets.razorpay_logo} alt="Razorpay" className="h-5" />
                      </button>
                    </div>
                  )}

                  {!item.cancelled && item.payment && !item.isCompleted && (
                    <span className="px-3 py-1 border rounded bg-blue-50 text-blue-600">Paid</span>
                  )}

                  {item.isCompleted && (
                    <span className="px-3 py-1 border border-green-500 rounded text-green-600">
                      Completed
                    </span>
                  )}

                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="border px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      Cancel Appointment
                    </button>
                  )}

                  {item.cancelled && (
                    <span className="px-3 py-1 border border-red-500 rounded text-red-600">
                      Appointment Cancelled
                    </span>
                  )}

                  {item.confirmed && !item.isCompleted && !item.cancelled && (
                    <span className="px-3 py-1 border border-blue-500 rounded text-blue-600">
                      Confirmed
                    </span>
                  )}

                  {item.reportUrl && (
                    <a
                      href={item.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="mt-2 text-sm px-2 py-1 rounded bg-green-600 text-white"
                    >
                      ⬇️ Download Report
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
