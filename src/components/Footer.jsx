import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 md:px-16 pt-12 pb-6 text-sm text-gray-600">
      <div className="grid gap-12 md:grid-cols-3 mb-12">
        {/* Logo + Description */}
        <div>
          <img src={assets.logo} alt="Logo" className="w-36 mb-4" />
          <p className="leading-relaxed max-w-md">
            Our Hospital Management System is the modern heartbeat of healthcare — 
            smart, seamless, and built with care. Simplify operations and enhance 
            patient experience with just a few clicks.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-base font-semibold text-gray-800 mb-4">COMPANY</h4>
          <ul className="space-y-2">
            <li className="hover:text-primary cursor-pointer transition">Home</li>
            <li className="hover:text-primary cursor-pointer transition">About us</li>
            <li className="hover:text-primary cursor-pointer transition">Delivery</li>
            <li className="hover:text-primary cursor-pointer transition">Privacy Policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-base font-semibold text-gray-800 mb-4">GET IN TOUCH</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="tel:+918101517647"
                className="hover:text-primary transition"
              >
                +91-8101517647
              </a>
            </li>
            <li>
              <a
                href="mailto:arogyaofficial@gmail.com"
                className="hover:text-primary transition"
              >
                arogyaofficial@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t pt-4 text-center text-xs text-gray-500">
        © 2025 Arogya.com — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
