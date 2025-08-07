// App.jsx
import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { jwtDecode } from 'jwt-decode'; // ✅ correct default import
import { AppContext } from './context/AppContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './components/ProtectedLayout';

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
// import Appointment from './pages/Appointment';
import MyProfile from './pages/MyProfile';
import Verify from './pages/Verify';
import Appointment from './pages/Appointment';
import Help from './pages/Help'

import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import UserMessages from './pages/UserMessages';
import Reports from './pages/Reports';

import Settings from './pages/Settings';
import MyDoctors from './pages/MyDoctors';
import MyAppointments from './pages/MyAppointments';

const App = () => {

  const { themeColor } = useContext(AppContext);
  const location = useLocation();
  const { token, authChecked } = useContext(AppContext);

  // Wait until context is fully loaded
  if (!authChecked) return <div className="text-center mt-10">Loading...</div>;

  const isTokenValid = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const isLoggedIn = Boolean(token && isTokenValid(token));
  const isProtectedRoute = location.pathname.startsWith('/main');

  return (
   
    
    <div
      className="min-h-screen"
      style={{ '--theme-color': themeColor }}
    >
      <ToastContainer />

      {/* Navbar and Footer shown only if not logged in */}
     {!isLoggedIn && !isProtectedRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <div className="mx-4 sm:mx-[10%]">
              <Home />
            </div>
          }
        />
        <Route
          path="/doctors"
          element={
            <div className="mx-4 sm:mx-[10%]">
              <Doctors />
            </div>
          }
        />
        <Route
          path="/doctors/:speciality"
          element={
            <div className="mx-4 sm:mx-[10%]">
              <Doctors />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="mx-4 sm:mx-[10%]">
              <Login />
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="mx-4 sm:mx-[10%]">
              <About />
            </div>
          }
        />
        <Route
          path="/contact"
          element={
            <div className="mx-4 sm:mx-[10%]">
              <Contact />
            </div>
          }
        />
         <Route path='/appointment/:docId' element={<Appointment />} />
   
       
       
        <Route
          path="/verify"
          element={
            <div className="mx-4 sm:mx-[10%]">
              <Verify />
            </div>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="/main/messages" element={<UserMessages />} />
          <Route path="reports" element={<Reports />} />
       
          <Route path="settings" element={<Settings />} />
          <Route path="my-appointments" element={<MyAppointments />} />
          <Route path="mydoctors" element={<MyDoctors />} />
          
          <Route path="my-profile" element={<MyProfile />} />
          <Route
          path="help"
          element={
            <div className="mx-4 sm:mx-[10%]">
              <Help />
            </div>
          }
        />
          
          {/* <Route path="appointment/:docId" element={<Appointment />} /> */}
        </Route>
      </Routes>

      {!isLoggedIn && !isProtectedRoute && <Footer />}
    </div>
    
    
  );
};

export default App;
