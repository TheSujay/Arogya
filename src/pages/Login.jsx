// src/pages/Login.jsx

import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../firebase";
import LoginImage from "../assets/LoginImage.svg";
import SignupImage from "../assets/SignupImage.svg";
import google_Icon from "../assets/google_Icon.png";

const Login = () => {
  const [state, setState] = useState("Login");
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  useEffect(() => {
    if (token) navigate("/main");
    else setLoading(false);
  }, [token, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { data } = await axios.post(`${backendUrl}/api/user/google-login`, {
        credential: idToken,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/main");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  const handleSendOtp = async () => {
    try {
      const endpoint =
        state === "Sign Up" ? "/api/user/register" : "/api/user/send-login-otp";

      const payload =
        state === "Sign Up" ? { name, email, password } : { email };

      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const payload =
        state === "Sign Up" ? { email, name, otp } : { email, otp };

      const { data } = await axios.post(`${backendUrl}/api/user/verify-otp`, payload);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/main");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("OTP verification failed");
    }
  };

  const handlePasswordLogin = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/main");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  const resetForm = () => {
    setEmail("");
    setName("");
    setPassword("");
    setOtp("");
    setStep(1);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="w-full flex justify-center">
          <img
            src={state === "Login" ? LoginImage : SignupImage}
            alt="Auth Visual"
            className="w-40 h-40 object-contain"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-center">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </h2>
          <p className="text-sm text-center text-gray-500 mt-1">
            Please {state === "Sign Up" ? "sign up" : "log in"} to book appointment
          </p>
        </div>

        <form className="flex flex-col gap-4">
          {state === "Sign Up" && step === 1 && (
            <>
              <div>
                <label className="block mb-1 text-sm">Full Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:outline-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md focus:outline-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md focus:outline-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={step === 2}
              required
            />
          </div>

          {step === 2 && (
            <div>
              <label className="block mb-1 text-sm">Enter OTP</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:outline-primary"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          {state === "Login" && step === 1 && (
            <div>
              <label className="block mb-1 text-sm">Password (optional)</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md focus:outline-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-3">
            {step === 1 ? (
              state === "Login" && password ? (
                <button
                  type="button"
                  onClick={handlePasswordLogin}
                  className="bg-primary text-white w-full py-2 rounded-md text-base"
                >
                  Login with Password
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="bg-primary text-white w-full py-2 rounded-md text-base"
                >
                  Send OTP
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="bg-primary text-white w-full py-2 rounded-md text-base"
              >
                Verify OTP
              </button>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2 border rounded-md flex items-center justify-center gap-3 hover:shadow transition"
            >
              <img src={google_Icon} alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700">
                Continue with Google
              </span>
            </button>
          </div>

          <p className="text-center text-sm mt-2">
            {state === "Sign Up"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span
              onClick={() => {
                resetForm();
                setState(state === "Sign Up" ? "Login" : "Sign Up");
              }}
              className="text-primary underline cursor-pointer"
            >
              {state === "Sign Up" ? "Login here" : "Sign up here"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
