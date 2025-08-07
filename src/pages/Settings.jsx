import React, { useEffect, useState } from "react";
import axios from "axios";
import edit_profile from "../assets/edit_profile.gif";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({
    name: "",
    phone: "",
    gender: "",
    dob: "",
    address: { line1: "", line2: "" },
  });
  const [image, setImage] = useState(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [history, setHistory] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/get-profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = res.data.user || res.data.userData;
        setUser(data);
        setEditableUser({
          name: data.name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          dob: data.dob || "",
          address: data.address || { line1: "", line2: "" },
        });
        setTwoFAEnabled(data.twoFactorEnabled || false);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/login-history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("History fetch failed", err);
      }
    };
    fetchHistory();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editableUser.name);
      formData.append("phone", editableUser.phone);
      formData.append("gender", editableUser.gender);
      formData.append("dob", editableUser.dob);
      formData.append("address", JSON.stringify(editableUser.address));
      if (image) formData.append("image", image);

      const res = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        setMessage("✅ Profile updated successfully.");
        setIsEdit(false);
        const refreshed = await axios.get(
          `${backendUrl}/api/user/get-profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(refreshed.data.user || refreshed.data.userData);
      } else {
        setMessage(res.data.message || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Update failed.");
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setMessage("Please provide both passwords.");
      return;
    }
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/change-password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Password update failed.");
    }
  };

  const handleToggle2FA = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/toggle-2fa`,
        { enabled: !twoFAEnabled },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTwoFAEnabled(!twoFAEnabled);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to toggle 2FA.");
    }
  };

  if (loading)
    return <div className="text-center text-gray-500 mt-20">Loading...</div>;
  if (!user)
    return <div className="text-center text-red-600 mt-20">User not found</div>;

  return (
    <div className="min-h-screen pt-20 sm:px-4 rounded-lg pb-10 bg-gray-50 animate-fadeIn font-futuristic max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white border rounded-2xl shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Profile Picture */}
          <label
            htmlFor="profileImage"
            className="relative cursor-pointer group transition-all duration-200 self-center"
          >
            <img
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-primary shadow-md transition-all duration-200"
              src={
                image
                  ? URL.createObjectURL(image)
                  : user.image || "https://via.placeholder.com/100"
              }
              alt="avatar"
            />
            {isEdit && (
              <span className="absolute bottom-1 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full shadow-md">
                ✏️ Edit
              </span>
            )}
            <input
              type="file"
              id="profileImage"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          {/* Editable or static user info */}
          <div className="flex-1 w-full">
            {isEdit ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["name", "phone", "dob", "gender"].map((field, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-semibold text-gray-600 capitalize">
                      {field === "dob" ? "Date of Birth" : field}
                    </label>
                    {field === "gender" ? (
                      <select
                        className="input w-full"
                        value={editableUser.gender}
                        onChange={(e) =>
                          setEditableUser({
                            ...editableUser,
                            gender: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    ) : (
                      <input
                        type={field === "dob" ? "date" : "text"}
                        className="input w-full"
                        value={editableUser[field]}
                        onChange={(e) =>
                          setEditableUser({
                            ...editableUser,
                            [field]: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                ))}
                <div className="col-span-full">
                  <label className="block text-xs font-semibold text-gray-600">
                    Address Line 1
                  </label>
                  <input
                    className="input w-full"
                    value={editableUser.address.line1}
                    onChange={(e) =>
                      setEditableUser({
                        ...editableUser,
                        address: {
                          ...editableUser.address,
                          line1: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="col-span-full">
                  <label className="block text-xs font-semibold text-gray-600">
                    Address Line 2
                  </label>
                  <input
                    className="input w-full"
                    value={editableUser.address.line2}
                    onChange={(e) =>
                      setEditableUser({
                        ...editableUser,
                        address: {
                          ...editableUser.address,
                          line2: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="col-span-full flex justify-center gap-3 mt-2">
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEdit(false)}
                    className="border px-4 py-2 rounded-xl hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">
                  {user.phone || "No Phone"} —{" "}
                  {[user.address?.line1, user.address?.line2]
                    .filter(Boolean)
                    .join(", ") || "No Address"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  👤 Member Since: {user.createdAt?.slice(0, 10) || "N/A"}
                </p>
                <button
                  className="mt-4 flex items-center gap-2 border border-primary text-primary px-3 py-2 rounded-lg"
                  onClick={() => setIsEdit(true)}
                >
                  <img src={edit_profile} alt="edit" className="w-4 h-4" />
                  <span className="text-sm">Edit Profile</span>
                </button>
              </div>
            )}
            {message && (
              <p className="mt-2 text-sm text-center text-primary">{message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="bg-white border rounded-2xl shadow-md p-4 sm:p-6 space-y-6">
        <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">
          🔐 Security Settings
        </h3>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Current Password
          </label>
          <input
            type="password"
            className="input w-full"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label className="block mt-4 mb-1 text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            className="input w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            className="mt-4 w-full bg-secondary text-white py-2 rounded-xl hover:opacity-90"
            onClick={handlePasswordChange}
          >
            Change Password
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Two-Factor Authentication</span>
          <button
            className={`px-3 py-1 rounded-xl text-white font-semibold ${
              twoFAEnabled
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            onClick={handleToggle2FA}
          >
            {twoFAEnabled ? "Disable" : "Enable"}
          </button>
        </div>

        {/* Login History Table */}
        <div>
          <h4 className="font-medium text-sm mb-2">📜 Login History</h4>
          <div className="max-h-60 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2">🕒 Date</th>
                  <th className="p-2">🌐 IP</th>
                  <th className="p-2">🧭 Browser</th>
                  <th className="p-2">💻 OS</th>
                  <th className="p-2">✅ Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-3 text-gray-500">
                      No login records.
                    </td>
                  </tr>
                ) : (
                  history.map((log, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-2">{log.date}</td>
                      <td className="p-2">{log.ip}</td>
                      <td className="p-2">{log.browser || "Unknown"}</td>
                      <td className="p-2">{log.os || "Unknown"}</td>
                      <td className="p-2">
                        {log.success ? (
                          <span className="text-green-600 font-semibold">
                            ✅ Success
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">
                            ❌ Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
