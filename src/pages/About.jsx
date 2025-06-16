import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="bg-gradient-to-r from-purple-700 via-purple-500 to-blue-400 min-h-screen text-white px-4 py-10">
      {/* Header */}
      <div className="text-center text-3xl font-semibold mb-10">
        <p>
          ABOUT <span className="text-gray-200">US</span>
        </p>
      </div>

      {/* About Section */}
      <div className="my-10 flex flex-col md:flex-row gap-12 items-center">
        <img
          className="w-full md:max-w-[360px] rounded-lg shadow-lg"
          src={assets.about_image}
          alt="About"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-base text-white">
          <p>
            Welcome to <strong>Arogya</strong>, your trusted partner in managing
            your healthcare needs conveniently and efficiently. At Arogya, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Arogya is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Arogya is here to support you every step of the way.
          </p>
          <h3 className="text-xl font-bold text-white">Our Vision</h3>
          <p>
            Our vision at Arogya is to create a seamless healthcare experience
            for every user. We aim to bridge the gap between patients and
            healthcare providers, making it easier for you to access the care
            you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center text-2xl font-semibold mb-6">
        <p>
          WHY <span className="text-gray-200">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-20">
        <div className="border border-white px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-white bg-white/10 rounded-xl hover:bg-white hover:text-purple-700 transition-all duration-300 cursor-pointer">
          <b>EFFICIENCY</b>
          <p>
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>
        <div className="border border-white px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-white bg-white/10 rounded-xl hover:bg-white hover:text-purple-700 transition-all duration-300 cursor-pointer">
          <b>CONVENIENCE</b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="border border-white px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-white bg-white/10 rounded-xl hover:bg-white hover:text-purple-700 transition-all duration-300 cursor-pointer">
          <b>PERSONALIZATION</b>
          <p>
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
