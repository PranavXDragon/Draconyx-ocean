'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, ChevronDown } from 'lucide-react';

interface FAQModalProps {
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQModal({ onClose }: FAQModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      category: 'general',
      question: 'What is SAMUDRASATHI?',
      answer: 'SAMUDRASATHI is an AI-powered coastal hazard reporting platform that enables citizens to report sea-related incidents in real-time. Our platform uses advanced AI verification to process reports and alert authorities for immediate action.',
    },
    {
      category: 'general',
      question: 'How do I report a hazard?',
      answer: 'Click the "Report Now" button, fill in the incident details, add photos or videos if available, and submit. Your location will be automatically captured. The AI will verify your report and notify relevant authorities.',
    },
    {
      category: 'general',
      question: 'Is the platform free to use?',
      answer: 'Yes! SAMUDRASATHI is completely free for all users. Our mission is to protect our oceans and coastal communities, and we believe access to safety tools should never be behind a paywall.',
    },
    {
      category: 'reporting',
      question: 'What types of hazards can I report?',
      answer: 'You can report oil spills, debris, marine life distress, unusual weather patterns, shark sightings, jellyfish swarms, strong currents, and any other coastal hazards that pose a threat to public safety or marine ecosystems.',
    },
    {
      category: 'reporting',
      question: 'Can I report anonymously?',
      answer: 'Yes, you can choose to remain anonymous when submitting a report. However, providing your contact information helps us verify reports more quickly and allows us to update you on the status.',
    },
    {
      category: 'reporting',
      question: 'How long does verification take?',
      answer: 'Our AI system typically verifies reports within 5-15 minutes. Critical emergencies are processed immediately and forwarded to the Coast Guard and local authorities for rapid response.',
    },
    {
      category: 'verification',
      question: 'How does AI verification work?',
      answer: 'Our AI analyzes your photos, videos, location data, and cross-references with satellite imagery, weather data, and social media reports to determine authenticity and severity. This multi-source verification ensures accurate threat assessment.',
    },
    {
      category: 'verification',
      question: 'What happens after my report is verified?',
      answer: 'Verified reports are immediately shared with relevant authorities (Coast Guard, Marine Police, Environmental agencies). You\'ll receive notifications about actions taken and earn points and badges for contributing to ocean safety.',
    },
    {
      category: 'gamification',
      question: 'How do I earn points and badges?',
      answer: 'You earn points for submitting verified reports, achieving high accuracy rates, reporting critical incidents, and maintaining reporting streaks. Badges are awarded for milestones like your first report, 10 verified reports, and achieving 90%+ trust score.',
    },
    {
      category: 'gamification',
      question: 'What is the Trust Score?',
      answer: 'Your Trust Score reflects the accuracy and reliability of your reports. It increases with verified reports and decreases with rejected or false reports. High trust scores unlock special badges and give your future reports priority verification.',
    },
    {
      category: 'technical',
      question: 'Does the app work offline?',
      answer: 'Yes! You can submit reports offline and they\'ll automatically sync when you regain internet connection. This is crucial for coastal areas with poor network coverage.',
    },
    {
      category: 'technical',
      question: 'Which devices are supported?',
      answer: 'SAMUDRASATHI works on all modern smartphones, tablets, and computers through your web browser. We support iOS, Android, Windows, Mac, and Linux. No app download required - it\'s a Progressive Web App (PWA).',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General' },
    { id: 'reporting', label: 'Reporting' },
    { id: 'verification', label: 'Verification' },
    { id: 'gamification', label: 'Gamification' },
    { id: 'technical', label: 'Technical' },
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 flex items-center justify-center z-[91] p-4"
      >
        <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-y-auto border border-white/10">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-cyan-400" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gradient">Frequently Asked Questions</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenIndex(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'glass text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-white pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-gray-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-8 glass rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
              <p className="text-gray-300 mb-4">
                Our support team is here to help you 24/7
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold text-white transition-all transform hover:scale-105"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
