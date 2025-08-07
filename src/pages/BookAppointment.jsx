import React, { useEffect, useState, useContext } from "react";
import { CalendarCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../styles/daypicker-custom.css";

const BookAppointment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [filterDoc, setFilterDoc] = useState([]);
  const [speciality, setSpeciality] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const doctorIdFromState = location.state?.doctorId;


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/doctor/list`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.doctors || [];
        setDoctors(list);
        setFilterDoc(list);

        if (doctorIdFromState) {
          const selected = list.find((doc) => doc._id === doctorIdFromState);
          if (selected) setSelectedDoctor(selected);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [backendUrl, doctorIdFromState]);

  const handleFilterClick = (value) => {
    if (value === speciality) {
      setSpeciality("");
      setFilterDoc(doctors);
    } else {
      setSpeciality(value);
      setFilterDoc(doctors.filter(doc => doc.speciality === value));
    }
    setSelectedDoctor(null);
  };

  const generateTimeSlots = (start, end, booked = []) => {
    const slots = [];
    for (let h = start; h < end; h++) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const period = h >= 12 ? "PM" : "AM";
      const timeStr = `${hour.toString().padStart(2, "0")}:00 ${period}`;
      if (!booked.includes(timeStr)) {
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const bookAppointment = async (docId, slotTime) => {
    if (!token) {
      toast.warning("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!selectedDate) {
      toast.warning("Please select a date");
      return;
    }

    const dateKey = `${selectedDate.getDate()}_${selectedDate.getMonth() + 1}_${selectedDate.getFullYear()}`;

    try {
      const res = await fetch(`${backendUrl}/api/user/book-appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ docId, slotDate: dateKey, slotTime }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        try {
          await getDoctorsData();
          navigate("/my-appointments");
        } catch (err) {
          console.warn("Post-booking update failed:", err);
        }
      } else {
        toast.error(data.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
      toast.error("Something went wrong while booking.");
    }
  };

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
  ];

  return (
    <div className="min-h-screen pt-20 px-6 py-10  bg-gray-50">
      <div className="flex items-center gap-3 mb-6">
        <CalendarCheck className="text-blue-600 w-6 h-6" />
        <h1 className="text-2xl font-semibold text-gray-800">Book Appointment</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {specialities.map((s, i) => (
          <p
            key={i}
            onClick={() => handleFilterClick(s)}
            className={`cursor-pointer px-4 py-2 border rounded-full text-sm transition-all
              ${speciality === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-blue-100 border-gray-300"
              }`}
          >
            {s}
          </p>
        ))}
      </div>

      <div className="bg-white border rounded-2xl shadow-md p-6">
        {loading ? (
          <p className="text-gray-500">Loading doctors...</p>
        ) : filterDoc.length === 0 ? (
          <p className="text-gray-500">No doctors available.</p>
        ) : selectedDoctor ? (
          // --- Detailed View ---
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Doctor Profile */}
            <div className="w-full lg:w-1/2 rounded-2xl border px-4 py-3 shadow-sm bg-white space-y-4">
              <button
                className="text-blue-500 text-sm mb-3 hover:underline"
                onClick={() => {
                  setSelectedDoctor(null);
                  setSelectedDate(null);
                  setSelectedSlot(null);
                }}
              >
                ← Back to doctors list
              </button>

              <div className="flex gap-4 items-center">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-20 h-20 rounded-full object-cover border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-doctor.png";
                  }}
                />
                <div>
                  <h2 className="text-xl font-semibold">{selectedDoctor.name}</h2>
                  <p className="text-sm text-gray-600">
                    {selectedDoctor.speciality} • {selectedDoctor.degree}
                  </p>
                  <p className="text-sm text-gray-400">
                    Exp: {selectedDoctor.experience} years
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p><span className="text-gray-500">Fees:</span> ₹{selectedDoctor.fees}</p>
                <p className="flex items-center gap-1">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${selectedDoctor.available ? "text-green-600" : "text-red-500"}`}>
                    {selectedDoctor.available ? "Active" : "Inactive"}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${selectedDoctor.available ? "bg-green-500" : "bg-red-500"}`}></span>
                </p>
                <p><span className="text-gray-500">Timings:</span> {selectedDoctor.startHour}:00 - {selectedDoctor.endHour}:00</p>
              </div>
            </div>

            {/* Calendar and Slots */}
            <div className="w-full lg:w-1/2 rounded-2xl border px-4 py-3 shadow-sm bg-white space-y-4">
              {!selectedDate ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Pick a Visiting Date</h3>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    modifiersClassNames={{
                      selected: "bg-blue-600 text-white",
                      today: "text-blue-500 font-semibold"
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-gray-800">
                      Available Slots on {format(selectedDate, "PPP")}
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedDate(null);
                        setSelectedSlot(null);
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Change Date
                    </button>
                  </div>

                  {(() => {
                    const dateKey = `${selectedDate.getDate()}_${selectedDate.getMonth() + 1}_${selectedDate.getFullYear()}`;
                    const booked = selectedDoctor.slots_booked?.[dateKey] || [];
                    const slots = generateTimeSlots(
                      selectedDoctor.startHour,
                      selectedDoctor.endHour,
                      booked
                    );

                    if (slots.length === 0) {
                      return <p className="text-sm text-red-500">No available slots for this date.</p>;
                    }

                    return (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {slots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`w-full py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200
                                ${selectedSlot === slot
                                  ? "bg-blue-600 text-white shadow"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-sm"
                                }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>

                        {selectedSlot && (
                          <button
                            onClick={() => bookAppointment(selectedDoctor._id, selectedSlot)}
                            className="w-full mt-5 py-2 px-4 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition duration-200"
                          >
                            Confirm Booking
                          </button>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        ) : (
          // --- Doctor List View ---
          <div className="grid gap-6 md:grid-cols-2">
            {filterDoc.map((doc) => (
              <div
                key={doc._id}
                className="rounded-2xl border border-gray-200 p-5 shadow-md bg-white"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-16 h-16 rounded-full object-cover border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-doctor.png";
                    }}
                  />
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">{doc.name}</h2>
                    <p className="text-sm text-gray-500">{doc.speciality} • {doc.degree}</p>
                    <p className="text-sm text-gray-400">Exp: {doc.experience} years</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p><span className="text-gray-500">Fees:</span> ₹{doc.fees}</p>
                  <p className="flex items-center gap-1">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`font-medium ${doc.available ? "text-green-600" : "text-red-500"}`}
                    >
                      {doc.available ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${doc.available ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                  </p>
                  <p><span className="text-gray-500">Timings:</span> {doc.startHour}:00 - {doc.endHour}:00</p>
                  <p><span className="text-gray-500">Place:</span> {doc.address.line1}</p>
                  
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => doc.available && setSelectedDoctor(doc)}
                    disabled={!doc.available}
                    className={`w-full py-2 text-sm rounded-lg transition
                      ${doc.available
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    {doc.available ? "Book Appointment" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
