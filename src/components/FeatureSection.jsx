import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white border border-[#2e3192]/10 rounded-xl p-6 shadow-sm hover:shadow-md transition"
  >
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-[#090a29] mb-1">{title}</h3>
    <p className="text-sm text-[#33354D]">{description}</p>
  </motion.div>
)

const FeaturesSection = () => {
  const [features, setFeatures] = useState([])

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await fetch(`${API}/api/features`)
        const data = await res.json()
        setFeatures(data)
      } catch {
        setFeatures([
          {
            icon: '🚀',
            title: 'Lightning Fast',
            description: 'Experience ultra-fast performance and responsiveness.',
          },
          {
            icon: '🛡️',
            title: 'Secure by Design',
            description: 'Built-in security features to keep your data safe.',
          },
          {
            icon: '⚙️',
            title: 'Customizable',
            description: 'Fully customizable to suit your workflow.',
          },
        ])
      }
    }
    fetchFeatures()
  }, [])

  return (
    <section className="py-16 px-4 sm:px-10 bg-[#f6faff] rounded-2xl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-[#2e3192] rounded-full shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#090a29]">
              Product Features
            </h2>
          </div>
          <p className="text-sm text-[#33354D]">
            Discover the key benefits that make our product powerful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((f, idx) => (
            <FeatureCard
              key={idx}
              icon={f.icon}
              title={f.title}
              description={f.description}
              delay={idx * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
