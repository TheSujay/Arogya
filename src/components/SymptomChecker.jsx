import React, { useState, useContext } from "react";
import { FaMicrophone, FaPaperPlane, FaVolumeUp } from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const SymptomChecker = () => {
  const { token } = useContext(AppContext);
  const isLoggedIn = Boolean(token);

  const [symptoms, setSymptoms] = useState("");
  const [prediction, setPrediction] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const FREE_LIMIT = 3;

  const checkLimit = () => {
    if (isLoggedIn) return true;
    const usageCount = parseInt(localStorage.getItem("symptomCheckerCount") || "0");
    if (usageCount >= FREE_LIMIT) {
      alert("⚠️ Free usage limit reached. Please log in or sign up to continue.");
      navigate("/login");
      return false;
    }
    localStorage.setItem("symptomCheckerCount", (usageCount + 1).toString());
    return true;
  };

  const fetchPrediction = async (symptomText) => {
    if (!symptomText.trim()) return;
    setLoading(true);
    setPrediction([]);
    setSuggestions([]);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomText }),
      });

      const data = await res.json();

      if (Array.isArray(data.prediction)) {
        setPrediction(data.prediction);
      } else {
        setPrediction([{ condition: "Error", description: "Invalid response format from server." }]);
      }

      if (Array.isArray(data.questions)) {
        setSuggestions(data.questions);
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction([{ condition: "Error", description: "❌ Failed to connect to prediction server." }]);
    }

    setLoading(false);
  };

  const handlePredict = () => {
    if (!symptoms.trim()) return;
    if (!checkLimit()) return;
    fetchPrediction(symptoms);
  };

  const handleVoiceInput = () => {
    if (!checkLimit()) return;
    setSymptoms("");
    setPrediction([]);
    setSuggestions([]);
    setListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setPrediction([{ condition: "Error", description: "🎤 Browser doesn't support speech recognition." }]);
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(transcript);
      setListening(false);
      fetchPrediction(transcript);
    };

    recognition.onerror = (event) => {
      setPrediction([{ condition: "Speech Error", description: `🎤 Error: ${event.error}` }]);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  };

  const handleClear = () => {
    setSymptoms("");
    setPrediction([]);
    setSuggestions([]);
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const defaultSymptoms = ["Headache", "Fever", "Cough", "Nausea", "Stomach pain", "Fatigue"];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-3xl">
      <h1 className="text-3xl font-bold text-center text-blue-800 flex items-center justify-center gap-2 mb-4">
        <MdOutlineHealthAndSafety className="text-4xl" /> AI Symptom Checker
      </h1>

      <textarea
        value={symptoms}
        onChange={(e) => {
          setSymptoms(e.target.value);
          if (!e.target.value.trim()) {
            setPrediction([]);
            setSuggestions([]);
          }
        }}
        placeholder="Describe your symptoms..."
        className="w-full p-4 rounded-xl border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
      />

      <div className="flex justify-between items-center mt-4 gap-2">
        <button
          onClick={handleVoiceInput}
          className={`flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md ${
            listening ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={listening}
        >
          <FaMicrophone />
          {listening ? "Listening..." : "Use Voice"}
        </button>

        <button
          onClick={handleClear}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-xl shadow"
        >
          Clear
        </button>

        <button
          onClick={handlePredict}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow-md"
        >
          <FaPaperPlane />
          Predict
        </button>
      </div>

      {!symptoms && prediction.length === 0 && (
        <div className="mt-6">
          <h3 className="text-sm text-gray-700 mb-2">🩺 Try one of these common symptoms:</h3>
          <div className="flex flex-wrap gap-2">
            {defaultSymptoms.map((symptom, index) => (
              <button
                key={index}
                onClick={() => {
                  setSymptoms(symptom);
                  fetchPrediction(symptom);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 px-3 py-1 rounded-full border border-gray-300 shadow-sm transition"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <p className="mt-4 text-center text-blue-600 font-semibold animate-pulse">
          🔄 Analyzing symptoms...
        </p>
      )}

      {!loading && prediction.length > 0 && (
        <div className="mt-10 space-y-8">
          <h2 className="text-2xl font-bold text-blue-800 border-b pb-2">
            🩺 Possible Conditions Based on Symptoms
          </h2>

          {prediction.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-blue-600 relative"
            >
              <div
                className="absolute top-2 right-4 text-blue-600 cursor-pointer"
                onClick={() => speakText(item.description)}
              >
                <FaVolumeUp />
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">{item.condition}</h3>
              <p className="whitespace-pre-line text-gray-700">{item.description}</p>
            </div>
          ))}

          {suggestions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">🧠 Follow-up Questions You Can Ask:</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {suggestions.map((q, i) => (
                  <li
                    key={i}
                    className="hover:text-blue-600 cursor-pointer"
                    onClick={() => {
                      setSymptoms(q);
                      fetchPrediction(q);
                    }}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
