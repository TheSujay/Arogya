import React, { useEffect, useState } from "react";
import axios from "axios";
import { Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MyDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendUrl}/api/user/my-doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen pt-20 px-6 py-10 bg-gradient-to-tr from-blue-50 to-white">
      <div className="flex items-center gap-3 mb-8">
        <Stethoscope className="text-blue-600 w-7 h-7" />
        <h1 className="text-3xl font-bold text-gray-800">My Doctors</h1>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-500">You haven't visited any doctors yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <motion.div
                
                key={doc._id}
  onClick={() => navigate("/main/book-appointment", { state: { doctorId: doc._id } })}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white p-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={doc.image || "/doctor-placeholder.png"}
                    alt={doc.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{doc.name}</h2>
                    <p className="text-sm text-blue-500 font-medium">{doc.speciality}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium text-gray-700">Experience:</span> {doc.experience} years</p>
                  <p><span className="font-medium text-gray-700">Fees:</span> ₹{doc.fees}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDoctors;
