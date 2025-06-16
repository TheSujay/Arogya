import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="bg-gradient-to-r from-purple-700 via-purple-500 to-blue-400 min-h-screen">
      {/* Header */}
      <div className='text-center text-3xl pt-10 text-white font-semibold'>
        <p>CONTACT <span className='text-gray-200 font-bold'>US</span></p>
      </div>

      {/* Contact Info Section */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-20 px-6 text-sm text-white'>
        <img className='w-full md:max-w-[360px] rounded-lg shadow-lg' src={assets.contact_image} alt="Contact" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg'>OUR OFFICE</p>
          <p>SALTORA <br /> 00, Bankura, WEST BENGAL</p>
          <p>
            Tel: <a href="tel:+918101517647" className="text-white underline hover:text-blue-200">+91-8101517647</a><br />
            Email: <a href="mailto:arogyaofficial@gmail.com" className="text-white underline hover:text-blue-200">arogyaofficial@gmail.com</a>
          </p>
          <p className='font-semibold text-lg'>CAREERS AT AROGYA</p>
          <p>Learn more about our teams and job openings.</p>
          <button className='border border-white px-6 py-2 rounded-full hover:bg-white hover:text-purple-700 transition-all duration-300'>
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="flex justify-center items-center pb-20 px-4">
        <div className="relative bg-white text-gray-700 rounded-[50px] max-w-lg w-full px-8 py-10 shadow-2xl text-center">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border-4 border-purple-700 w-16 h-16 rounded-full flex items-center justify-center text-2xl text-purple-700 shadow-lg">
            🚀
          </div>
          <h2 className="text-xl font-semibold mb-6 mt-6">Drop Us a Message</h2>
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Asiq" className="border border-gray-300 px-4 py-2 rounded-xl focus:outline-none" required />
            <input type="email" placeholder="asiq@gmail.com" className="border border-gray-300 px-4 py-2 rounded-xl focus:outline-none" required />
            <input type="tel" placeholder="9087897564" className="border border-gray-300 px-4 py-2 rounded-xl focus:outline-none" required />
            <textarea placeholder="Love your service. Thank you!" className="border border-gray-300 px-4 py-2 rounded-xl resize-none h-24 focus:outline-none" required />
            <button type="submit" className="bg-purple-700 hover:bg-purple-900 text-white py-2 rounded-full transition duration-300">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
