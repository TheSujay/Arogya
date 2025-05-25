import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className=' font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className=' text-gray-500'>SALTORA <br /> 00, Bankura, WESTBENGAL</p>
          <p className=' text-gray-500'>
            Tel: <a href="tel:+918101517647" className="text-blue-600 hover:underline">+91-8101517647</a> <br />
            <span>
              Email: <a href="mailto:arogya@gmail.com" className="text-blue-600 hover:underline">arogya@gmail.com</a>
            </span>
          </p>
          <p className=' font-semibold text-lg text-gray-600'>CAREERS AT AROGYA</p>
          <p className=' text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

    </div>
  )
}

export default Contact
