import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
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
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Format slotDate like 20_01_2025 => 20 Jan 2025
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    if (dateArray.length !== 3) return "Invalid Date";
    return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
  };

  // ✅ Get user appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(data.appointments)) {
        setAppointments([...data.appointments].reverse());
      } else {
        setAppointments([]);
        toast.warn("No appointments found.");
      }
    } catch (error) {
      console.error("Fetch Appointments Error:", error);
      toast.error(error.message || "Failed to fetch appointments.");
    }
  };

  // ✅ Cancel appointment
  const cancelAppointment = async (appointmentId) => {
  try {
    // ✅ Add validation
    if (!appointmentId) {
      toast.error("Invalid appointment ID");
      return;
    }

    console.log("🔎 Frontend: Cancelling appointment:", appointmentId);

    const { data } = await axios.post(
      `${backendUrl}/api/user/cancel-appointment`,
      { appointmentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("📡 Frontend: Response received:", data);

    if (data.success) {
      toast.success(data.message);
      // ✅ Refresh appointments
      getUserAppointments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("❌ Frontend Cancel Error:", error);
    console.error("❌ Error response:", error.response?.data);
    toast.error(error.response?.data?.message || error.message || "Cancel request failed.");
  }
};

  // ✅ Payment (Razorpay)
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments");
          }
        } catch (error) {
          console.error("Razorpay verification error:", error);
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

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Razorpay Error:", error);
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

      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Stripe Error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My appointments
      </p>
      <div className="">
        {appointments.length === 0 ? (
          <p className="mt-4 text-gray-500">No appointments found.</p>
        ) : (
          appointments.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
            >
              <div>
                <img
                  className="w-36 bg-[#EAEFFF]"
                  src={item.docData.image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-[#5E5E5E]">
                <p className="text-[#262626] text-base font-semibold">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="text-[#464646] font-medium mt-1">Address:</p>
                <p>{item.userData?.address?.line1}</p>
                <p>{item.userData?.address?.line2}</p>
                <p className="mt-1">
                  <span className="text-sm text-[#3C3C3C] font-medium">
                    Date & Time:
                  </span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-end text-sm text-center">
                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  payment !== item._id && (
                    <button
                      onClick={() => setPayment(item._id)}
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Pay Online
                    </button>
                  )}
                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  payment === item._id && (
                    <>
                      <button
                        onClick={() => appointmentStripe(item._id)}
                        className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                      >
                        <img
                          className="max-w-20 max-h-5"
                          src={assets.stripe_logo}
                          alt="Stripe"
                        />
                      </button>
                      <button
                        onClick={() => appointmentRazorpay(item._id)}
                        className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                      >
                        <img
                          className="max-w-20 max-h-5"
                          src={assets.razorpay_logo}
                          alt="Razorpay"
                        />
                      </button>
                    </>
                  )}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]">
                    Paid
                  </button>
                )}
                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}
                {item.confirmed && !item.isCompleted && !item.cancelled && (
                  <button className="sm:min-w-48 py-2 border border-blue-500 rounded text-blue-500">
                    Confirmed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
