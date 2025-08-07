import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL;

const FaqSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [filter, setFilter] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API}/api/faqs`);
        const data = await res.json();
        setFaqs(data);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
        setFaqs([
          { id: 1, question: 'What is the purpose of this product?', answer: 'It streamlines your workflow.', category: 'Product' },
          { id: 2, question: 'Is there a free trial?', answer: 'Yes, 14 days full access.', category: 'Billing' },
          { id: 3, question: 'How do I contact support?', answer: 'Email or live chat 24/7.', category: 'Support' },
          { id: 4, question: 'Is my data secure?', answer: 'End-to-end encryption & GDPR compliant.', category: 'Security' },
          { id: 5, question: 'Can I cancel anytime?', answer: 'Yes, from your dashboard.', category: 'Billing' },
          { id: 6, question: 'Does it work on mobile?', answer: 'Yes, it is fully responsive.', category: 'Product' },
        ]);
      }
    };

    fetchFaqs();
  }, []);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category).filter(Boolean)))];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(filter.toLowerCase()) &&
    (selectedCategory === 'All' || faq.category === selectedCategory)
  );

  const visibleFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 5);

  return (
    <section className="bg-white rounded-xl shadow-xl p-8 md:p-10 space-y-12 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-purple-100 border border-purple-300">
              <HelpCircle className="w-6 h-6 text-purple-700" />
            </div>
            <h2 className="text-4xl font-bold text-purple-800">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Need help? Browse through common questions to get quick answers about Arogya.
          </p>
        </div>

        {/* Search & Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 max-w-xl mx-auto"
        >
          <input
            type="text"
            placeholder="Search FAQs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat, index) => (
              <button
                key={`category-${cat}-${index}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1 text-sm rounded-full border transition ${
                  selectedCategory === cat
                    ? 'bg-purple-100 text-purple-700 border border-purple-300 font-medium'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleFaqs.map((faq, i) => (
              <motion.div
                key={faq.id || `${faq.question}-${i}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
              >
                <button
                  onClick={() => toggleIndex(i)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-base font-semibold">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden mt-3 text-gray-600 text-sm leading-relaxed"
                    >
                      <div>{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View More Button */}
        {filteredFaqs.length > 5 && (
          <div className="text-center pt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 text-sm font-semibold text-purple-700 bg-purple-100 border border-purple-300 rounded-full hover:bg-purple-200 transition"
            >
              {showAll ? 'View Less' : 'View More'}
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredFaqs.length === 0 && (
          <div className="text-center text-gray-500 text-base pt-10">
            No FAQs found matching your search.
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
