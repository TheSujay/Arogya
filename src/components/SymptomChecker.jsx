import React, { useState, useContext } from 'react';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // <-- adjust this path

const SymptomChecker = () => {
  const { token } = useContext(AppContext);
  const isLoggedIn = Boolean(token);

  const [symptoms, setSymptoms] = useState('');
  const [prediction, setPrediction] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const FREE_LIMIT = 3;

  const checkLimit = () => {
    if (isLoggedIn) {
      // Unlimited usage for logged-in users
      return true;
    }

    const usageCount = parseInt(localStorage.getItem('symptomCheckerCount') || '0');

    if (usageCount >= FREE_LIMIT) {
      alert('⚠️ Free usage limit reached. Please log in or sign up to continue.');
      navigate('/login');
      return false;
    }

    localStorage.setItem('symptomCheckerCount', (usageCount + 1).toString());
    return true;
  };

  const fetchPrediction = async (symptomText) => {
    if (!symptomText.trim()) return;

    setLoading(true);
    setPrediction('');  // clear old prediction before loading

    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomText }),
      });
      const data = await res.json();

      if (data?.prediction) {
        setPrediction(Array.isArray(data.prediction) ? data.prediction.join(', ') : data.prediction);
      } else {
        setPrediction(data?.error ? `❌ Error: ${data.error}` : '⚠️ No prediction found.');
      }
    } catch (err) {
      setPrediction('❌ Error fetching prediction');
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

    // Clear previous symptoms and predictions on each new voice input
    setSymptoms('');
    setPrediction('');
    setListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setPrediction('🎤 Your browser does not support speech recognition.');
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(transcript);
      setListening(false);

      // Automatically fetch prediction after speech is recognized
      fetchPrediction(transcript);
    };

    recognition.onerror = (event) => {
      setPrediction(`🎤 Speech recognition error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-3xl">
      <h1 className="text-3xl font-bold text-center text-blue-800 flex items-center justify-center gap-2 mb-4">
        <MdOutlineHealthAndSafety className="text-4xl" /> AI Symptom Checker
      </h1>

      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Describe your symptoms..."
        className="w-full p-4 rounded-xl border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
      />

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleVoiceInput}
          className={`flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition duration-200 ${
            listening ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={listening}
        >
          <FaMicrophone />
          {listening ? 'Listening...' : 'Use Voice'}
        </button>

        <button
          onClick={handlePredict}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition duration-200"
        >
          <FaPaperPlane />
          Predict
        </button>
      </div>

      {loading ? (
        <p className="mt-4 text-center text-blue-600 font-semibold animate-pulse">
          Analyzing symptoms...
        </p>
      ) : prediction && (
        <div className="mt-6 bg-green-100 border border-green-400 text-green-800 p-4 rounded-xl shadow-inner">
          <h2 className="text-xl font-extrabold text-center mb-3 text-green-900">
            🩺 Predicted Conditions:
          </h2>
          <div className="space-y-2 text-left text-base text-green-800">
            {prediction.split(',').map((condition, index) => (
              <p
                key={index}
                className="bg-green-200 font-semibold rounded-md px-3 py-1"
              >
                {condition.trim()}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
