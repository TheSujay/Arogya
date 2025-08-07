import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets.js";
import clsx from "clsx";

const Chatbot = () => {
  const { userData, token, showMobileMenu } = useContext(AppContext);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (showChat) {
      setMessages([
        {
          from: "bot",
          text: userData?.name
            ? `👋 Hello ${userData.name}! I'm Arogya AI Assistant.\nHow can I help you today?`
            : `👋 Hello! I'm Arogya AI Assistant.\nYou can explore doctor info, but please login or sign up for full features.`,
        },
      ]);
    }
  }, [showChat, userData]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsgs = [...messages, { from: "user", text: input }];
    setMessages(newMsgs);
    setInput("");

    try {
      const res = await axios.post(
        "https://arogya-backend-wohi.onrender.com/api/chat",
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
              onClick: () => (window.location.href = "/main/book-appointment"),
            },
            {
              label: "🗂️ View My Appointments",
              onClick: () => (window.location.href = "/main/my-appointments"),
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
    <div
      className={clsx(
        "fixed z-50 transition-all",
        "bottom-24 right-4 md:bottom-10 md:right-20",
        showMobileMenu && "hidden"
      )}
    >
      {/* Toggle Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="transition-transform hover:scale-110 animate-bounce"
          title="Open Arogya AI"
        >
          <img
            src={assets.bot_icon}
            alt="AI Icon"
            className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
          />
        </button>
      )}

      {/* Chat Interface */}
      {showChat && (
        <div className="w-[90vw] max-w-[370px] h-[70vh] sm:h-[410px] shadow-2xl rounded-xl bg-gradient-to-tr from-blue-900 to-purple-800 text-white p-4 flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setShowChat(false)}
            className="absolute top-2 right-3 text-white text-sm hover:text-red-300"
          >
            ❌
          </button>

          {/* Header */}
          <div className="text-center font-semibold text-base sm:text-lg mb-2 mt-1">
            <div className="flex items-center justify-center gap-2">
              <img src={assets.stethoscope_icon} alt="" className="w-5 h-5" />
              <span className="font-bold">Arogya AI Assistant</span>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-2 text-sm sm:text-base scrollbar-thin pr-2"
          >
            {messages.map((msg, i) => {
              if (msg.type === "buttons") {
                return (
                  <div key={i} className="flex flex-col gap-2 text-left">
                    {msg.options.map((btn, index) => (
                      <button
                        key={index}
                        onClick={btn.onClick}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm w-fit"
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
          <div className="flex gap-2 mt-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2 rounded-lg text-black text-sm"
              placeholder="Ask me anything..."
            />
            <button
              onClick={sendMessage}
              className="bg-white text-black px-3 py-2 rounded-lg text-sm"
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
