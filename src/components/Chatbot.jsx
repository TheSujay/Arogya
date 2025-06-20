import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets.js";

// 👇 Replace this with your actual icon path


const Chatbot = () => {
  const { userData, token } = useContext(AppContext);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `👋 Hello ${userData?.name || "Guest"}! I'm Arogya AI Assistant.\nHow can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsgs = [...messages, { from: "user", text: input }];
    setMessages(newMsgs);
    setInput("");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/chat",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reply = res.data.reply;

      if (
        /book.*appointment|how.*appointment/i.test(input) ||
        /see.*appointments|my appointments/i.test(input)
      ) {
        const extraButtons = {
          type: "buttons",
          options: [
            {
              label: "📅 Book Appointment",
              onClick: () => (window.location.href = "/book-appointment"),
            },
            {
              label: "🗂️ View My Appointments",
              onClick: () => (window.location.href = "/my-appointments"),
            },
          ],
        };
        setMessages([...newMsgs, { from: "bot", text: reply }, extraButtons]);
      } else {
        setMessages([...newMsgs, { from: "bot", text: reply }]);
      }
    } catch (err) {
      setMessages([
        ...newMsgs,
        { from: "bot", text: "⚠️ Failed to get a response." },
      ]);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-10 right-20 z-50">
      {/* 🧠 Custom Icon Toggle Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="transition-transform hover:scale-110 animate-bounce"
          title="Open Arogya AI"
        >
          <img
            src={assets.bot_icon} // Fallback to local icon if assets not available
            alt="AI Icon"
            className="w-20 h-20 object-contain" // You can adjust size here
          />
        </button>
      )}

      {/* Chat Interface */}
      {showChat && (
        <div className="w-[370px] shadow-xl rounded-xl bg-gradient-to-tr from-blue-900 to-purple-800 text-white p-4 space-y-2 relative">
          {/* Close Button */}
          <button
            onClick={() => setShowChat(false)}
            className="absolute top-2 right-2 text-white text-sm hover:text-red-300"
          >
            ❌
          </button>
          

          {/* Header */}
          <div className="text-center font-semibold text-lg mb-2">
            <div className="flex items-center justify-center gap-1"> <img src={assets.stethoscope_icon} alt="" className="w-5 h-5 object-contain" /><span className="text-white font-bold">Arogya AI Assistant</span></div>
          </div>

          {/* Messages */}
          <div
            className="h-64 overflow-y-auto space-y-2 text-sm scrollbar-thin pr-2"
            ref={scrollRef}
          >
            {messages.map((msg, i) => {
              if (msg.type === "buttons") {
                return (
                  <div key={i} className="flex flex-col gap-2 text-left">
                    {msg.options.map((btn, index) => (
                      <button
                        key={index}
                        onClick={btn.onClick}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm w-fit"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`text-${msg.from === "bot" ? "left" : "right"}`}
                >
                  <div
                    className={`p-2 rounded-xl inline-block whitespace-pre-line ${
                      msg.from === "bot"
                        ? "bg-white text-black"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2 rounded-lg text-black"
              placeholder="Ask me anything..."
            />
            <button
              onClick={sendMessage}
              className="bg-white text-black px-3 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
