import React, { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { io } from "socket.io-client";
import clsx from "clsx";
import { MessageSquare } from "lucide-react";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000", {
  withCredentials: true,
});

const UserMessages = () => {
  const { token, backendUrl, userData } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userData?._id) return;
    socket.emit("register", { userId: userData._id });
  }, [userData]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/messages/user-doctors`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) setDoctors(data.doctors);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const fetchMessages = async (doctor) => {
    setSelectedDoctor(doctor);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/messages/user/messages`,
        { doctorId: doctor._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedDoctor) return;

    const messageToSend = {
      senderId: userData._id,
      receiverId: selectedDoctor._id,
      senderModel: "user",
      receiverModel: "doctor",
      content: newMessage,
    };

    socket.emit("privateMessage", messageToSend);
    setNewMessage("");
  };

  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      const doctorId = selectedDoctor?._id;
      const senderId = msg.senderId._id;
      const receiverId = msg.receiverId._id;

      if (doctorId && (senderId === doctorId || receiverId === doctorId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("privateMessage", handleIncomingMessage);
    return () => {
      socket.off("privateMessage", handleIncomingMessage);
    };
  }, [selectedDoctor]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50 px-2 pt-20 pb-6 sm:px-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Messages
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row bg-white shadow rounded-xl overflow-hidden h-[80vh]">
        {/* Doctor List */}
        <aside className="sm:w-1/3 bg-gray-100 border-r overflow-y-auto">
          <div className="bg-white sticky top-0 z-10 p-3 font-semibold border-b">
            My Doctors
          </div>
          {doctors.map((doc) => (
            <div
              key={doc._id}
              onClick={() => fetchMessages(doc)}
              className={clsx(
                "p-4 border-b cursor-pointer transition-all",
                selectedDoctor?._id === doc._id
                  ? "bg-blue-100 font-medium"
                  : "hover:bg-blue-50"
              )}
            >
              <p className="text-sm sm:text-base">{doc.name}</p>
              <p className="text-xs text-gray-500">{doc.email}</p>
            </div>
          ))}
        </aside>

        {/* Chat Window */}
        <main className="flex-1 flex flex-col">
          {selectedDoctor ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b p-4 sticky top-0 z-10">
                <h2 className="text-base font-semibold">{selectedDoctor.name}</h2>
                <p className="text-sm text-gray-500">{selectedDoctor.email}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 space-y-3">
                {messages.map((msg, idx) => {
                  const isSender =
                    (msg.senderId?._id || msg.senderId) === userData._id;
                  return (
                    <div
                      key={idx}
                      className={clsx(
                        "max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-sm",
                        isSender
                          ? "ml-auto bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      )}
                    >
                      <div>{msg.content}</div>
                      <div className="text-[10px] text-gray-300 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 border-t bg-white flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 text-sm"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Select a doctor to start chatting
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserMessages;
