import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL

const AnnouncementCard = ({ date, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white border border-[#2e3192]/10 rounded-xl p-6 shadow-sm hover:shadow-md transition"
  >
    <div className="text-sm text-[#74a9f0] font-medium mb-2 flex items-center gap-2">
      <CalendarDays className="w-4 h-4" />
      {new Date(date).toLocaleDateString()}
    </div>
    <h3 className="text-lg font-semibold text-[#090a29] mb-1">{title}</h3>
    <p className="text-sm text-[#33354D]">{description}</p>
  </motion.div>
)

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${API}/api/announcements`)
        const data = await res.json()
        setAnnouncements(data)
      } catch {
        setAnnouncements([
          {
            date: '2025-06-15',
            title: 'UI Overhaul Complete',
            description: 'Brand new futuristic UI launched across all platforms!',
          },
          {
            date: '2025-06-10',
            title: 'New Integrations',
            description: 'Now supports Slack, GitHub, Notion, and more.',
          },
        ])
      }
    }
    fetchAnnouncements()
  }, [])

  return (
    <section className="py-16 px-4 sm:px-10 bg-[#f6faff] rounded-2xl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-[#2e3192] rounded-full shadow-md">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#090a29]">
              Latest Announcements
            </h2>
          </div>
          <p className="text-sm text-[#33354D]">
            Stay informed about product updates and news.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {announcements.map((a, idx) => (
            <AnnouncementCard
              key={idx}
              date={a.date}
              title={a.title}
              description={a.description}
              delay={idx * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AnnouncementsSection
