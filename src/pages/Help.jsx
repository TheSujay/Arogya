import React, { useState } from 'react';
import { assets } from '../assets/assets';
import FaqSection from '../components/FaqSection';

const Help = () => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("access_key", import.meta.env.VITE_WEB3FORM_ACCESS_KEY);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      setSuccess(true);
      e.target.reset();
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="bg-[#f7f7fc] min-h-screen py-20 px-4 text-gray-800">
      {/* Header */}
      <h2 className="text-4xl font-bold text-purple-800 mb-12">
        Contact <span className="text-purple-600">Us</span>
      </h2>

      {/* Content in columns */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        {/* Left Column: Contact Info */}
        <div className="bg-white p-8 rounded-xl shadow-xl w-full flex flex-col justify-between">
          <img
            src={assets.contact_image}
            alt="Contact"
            className="w-full h-72 object-cover object-center rounded-lg mb-6"
          />

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-xl font-semibold text-purple-700">Our Office</h3>
              <p>SALTORA<br />00, Bankura, WEST BENGAL</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-700">Contact Info</h3>
              <p>
                Phone: <a href="tel:+918101517647" className="text-purple-600 underline">+91-8101517647</a><br />
                Email: <a href="mailto:arogyaofficial@gmail.com" className="text-purple-600 underline">arogyaofficial@gmail.com</a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-700">Careers</h3>
              <p>Join our mission to make healthcare accessible.</p>
              <button className="mt-2 px-6 py-2 rounded-full border border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white transition-all">
                Explore Jobs
              </button>
            </div>
          </div>
        </div>

     {/* Right Column: Contact Form */}
<div className="bg-white rounded-xl shadow-xl p-8 w-full h-full flex flex-col justify-between">
  <h3 className="text-2xl font-semibold text-center mb-6 text-purple-800">Drop Us a Message</h3>

  {success ? (
    <p className="text-green-600 text-center font-medium mt-auto">
      ✅ Thanks for your message! We'll get back to you soon.
    </p>
  ) : (
    <form onSubmit={handleSubmit} className="flex flex-col flex-grow justify-between space-y-4 h-full">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="block w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        className="block w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        className="block w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
      <textarea
        name="message"
        placeholder="Write your message here..."
        className="block w-full border border-gray-300 px-4 py-3 rounded-md resize-none flex-grow focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      ></textarea>
      <button
        type="submit"
        className="w-full bg-purple-700 text-white py-3 rounded-md hover:bg-purple-800 transition duration-300"
      >
        Send Message
      </button>
    </form>
  )}
</div>

      </div >
      <div className='max-w-6xl mx-auto mt-20'>
<FaqSection />
</div>
    </div>
    
  );
};

export default Help;
