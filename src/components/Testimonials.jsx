import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const pauseTimeout = useRef(null);

 
    
    useEffect(() => {
  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/testimonials`);
      const json = await res.json();
      setTestimonials(json);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    }
  };

  fetchTestimonials();
}, []);


  // Smart pause logic
  const smartPause = () => {
    setIsPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000); // resume autoplay after 5 seconds
  };

  useEffect(() => {
    if (testimonials.length < 3) return;
    const interval = setInterval(() => {
      if (!isPaused) {
        setIndex((prev) => (prev + 1) % testimonials.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials, isPaused]);

  useEffect(() => {
    return () => {
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    };
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    smartPause();
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
    smartPause();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    smartPause();
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) handlePrev();
    if (delta < -50) handleNext();
    touchStartX.current = null;
  };

  const getCarouselCards = () => {
    const total = testimonials.length;
    if (total === 0) return [];
    if (total === 1) return [testimonials[0]];
    if (total === 2) {
      const left = testimonials[(index - 1 + total) % total];
      const center = testimonials[index % total];
      return [left, center];
    }

    const center = testimonials[index % total];
    const left = testimonials[(index - 1 + total) % total];
    const right = testimonials[(index + 1) % total];
    return [left, center, right];
  };

  const positions = [
    {
      scale: 0.85,
      x: '-220px',
      rotateY: 25,
      zIndex: 1,
      opacity: 0.5,
    },
    {
      scale: 1,
      x: '0px',
      rotateY: 0,
      zIndex: 3,
      opacity: 1,
    },
    {
      scale: 0.85,
      x: '220px',
      rotateY: -25,
      zIndex: 1,
      opacity: 0.5,
    },
  ];

  const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => {
    const isFull = i < Math.floor(rating);
    const isHalf = !isFull && i < rating;

    return (
      <div key={i} className="relative w-5 h-5">
        {/* Empty Star (background) */}
        <Star className="text-gray-300 absolute w-full h-full" />

        {/* Full or Half Star (foreground) */}
        {isFull && (
          <Star className="text-yellow-400 absolute w-full h-full" fill="currentColor" />
        )}
        {isHalf && (
          <Star
            className="text-yellow-400 absolute w-full h-full overflow-hidden"
            fill="currentColor"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        )}
      </div>
    );
  });
};


  return (
    <section
      className="py-20 px-4 sm:px-6  lg:px-8 rounded-lg text-gray-800 relative overflow-hidden"
      onMouseEnter={smartPause}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-14 text-gray-800 drop-shadow">
          What People Are Saying
        </h2>

        <div className="relative h-[500px] flex items-center justify-center space-x-4">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition"
          >
            <ChevronLeft className="w-7 h-7 text-gray-800" />
          </button>

          {/* Carousel Cards */}
          <AnimatePresence initial={false}>
            {getCarouselCards().map((testimonial, i) => {
              const pos = positions[i];
              if (!testimonial) return null;

              return (
                <motion.div
                  key={testimonial.name + index + i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: pos.opacity,
                    scale: pos.scale,
                    x: pos.x,
                    rotateY: pos.rotateY,
                    zIndex: pos.zIndex,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="absolute w-[320px] sm:w-[380px] lg:w-[420px] min-h-[340px] p-8 bg-gradient-to-r from-blue-700 via-cyan-400 to-emerald-500 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur text-white"
                  style={{ perspective: '1000px' }}
                >
                  <Quote className="absolute top-4 right-4 text-white/30 w-8 h-8" />
                  <p className="italic text-white/90 text-base sm:text-lg mb-4">"{testimonial.quote}"</p>
                  <div className="flex gap-1 mb-3">{renderStars(testimonial.rating || 0)}</div>
                  <div className="flex items-center gap-3 mt-4">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full border border-white/20 shadow"
                      />
                    )}
                    <div>
                      <p className="text-md font-semibold">{testimonial.name}</p>
                      {testimonial.role && (
                        <p className="text-sm text-white/70">{testimonial.role}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition"
          >
            <ChevronRight className="w-7 h-7 text-gray-800" />
          </button>
        </div>

        {/* Dot Pagination */}
        <div className="flex justify-center mt-10 space-x-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                smartPause();
              }}
              className={`w-3.5 h-3.5 rounded-full ${
                i === index ? 'bg-gray-800' : 'bg-gray-400'
              } transition-all duration-300`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
