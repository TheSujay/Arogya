import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import SplitText from './SplitText';
import HeaderVideo from '../assets/HeaderVideo.webm';

const MainHeader = () => {
  const { userData } = useContext(AppContext);

  const handleAnimationComplete = () => {};

  return (
    <div className="flex flex-col-reverse md:flex-row bg-gradient-to-br from-blue-700 via-cyan-400 to-emerald-500 rounded-2xl p-4 md:p-10 min-h-[360px] md:min-h-[440px] shadow-md">
      {/* Right Section (Video on top for mobile) */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative min-h-[240px] md:min-h-[320px] mb-6 md:mb-0">
        <div className="relative w-full max-w-[320px] md:max-w-[460px] h-full">
          {/* SVG cloud */}
          <svg
            viewBox="0 0 460 320"
            className="absolute w-full h-full animate-float pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="cloudClip">
                <ellipse cx="230" cy="160" rx="200" ry="110" />
                <ellipse cx="110" cy="95" rx="55" ry="34" />
                <ellipse cx="330" cy="80" rx="50" ry="30" />
                <ellipse cx="160" cy="240" rx="45" ry="26" />
                <ellipse cx="300" cy="250" rx="38" ry="24" />
              </clipPath>

              <filter id="cloudGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="18" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#cloudGlow)" fill="#fff" fillOpacity="0.6">
              <ellipse cx="230" cy="160" rx="200" ry="110" />
              <ellipse cx="110" cy="95" rx="55" ry="34" />
              <ellipse cx="330" cy="80" rx="50" ry="30" />
              <ellipse cx="160" cy="240" rx="45" ry="26" />
              <ellipse cx="300" cy="250" rx="38" ry="24" />
            </g>
          </svg>

          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-10"
            src={HeaderVideo}
            autoPlay
            loop
            muted
            playsInline
            style={{
              clipPath: 'url(#cloudClip)',
              WebkitClipPath: 'url(#cloudClip)',
            }}
          />
        </div>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col items-start md:items-start justify-center text-center md:text-left gap-3 md:gap-5 px-2 md:px-6">
        {userData ? (
          <SplitText
            text={`Welcome, ${userData.name}!`}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight drop-shadow-xl animate-fade-in"
            delay={60}
            duration={0.7}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            onLetterAnimationComplete={handleAnimationComplete}
          />
        ) : (
          <div className="text-2xl font-bold text-white animate-pulse">Loading...</div>
        )}
        <p className="mt-2 text-sm sm:text-base md:text-lg text-white text-opacity-90 animate-fade-in-slow">
          Hope you have a productive day at Arogya!
        </p>
      </div>
    </div>
  );
};

export default MainHeader;
