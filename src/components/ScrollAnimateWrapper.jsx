// components/ScrollAnimateWrapper.js
import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const ScrollAnimateWrapper = ({ children }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollAnimateWrapper
