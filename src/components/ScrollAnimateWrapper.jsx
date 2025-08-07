// components/ScrollAnimateWrapper.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 }
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }
}

const ScrollAnimateWrapper = ({
  children,
  animation = 'slideUp',
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  triggerOnce = false,
  ease = 'easeOut',
  className = ''
}) => {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold
  })

  const variant = animationVariants[animation] || animationVariants.slideUp

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration, delay, ease }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollAnimateWrapper
