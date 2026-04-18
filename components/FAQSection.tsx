'use client'
import { useState } from 'react'

const faqs = [
  {
    question: 'How much do music lessons cost?',
    answer:
      'Your first trial lesson is just $29 — that\'s it! After your trial you can choose from our flexible monthly lesson packages. We\'ll help you find the best fit for your goals and budget.',
  },
  {
    question: 'What ages do you teach?',
    answer:
      'All ages are welcome! We teach kids as young as 5 all the way to adults of any age. Our approach adapts to each student — whether it\'s a child\'s first encounter with music or an adult returning to an old passion.',
  },
  {
    question: 'What instruments and skills do you offer?',
    answer:
      'We offer lessons in voice/singing, piano, guitar, violin, drums, and music theory. Each instrument has dedicated instructors who tailor lessons to your level and goals.',
  },
  {
    question: 'Are lessons in-person or online?',
    answer:
      'Both! We offer in-person lessons at our Las Vegas studio (9205 W Russell Rd Building 3) and live online lessons for students anywhere in the world. Same great quality, your choice of format.',
  },
  {
    question: 'How long is each lesson?',
    answer:
      '30-minute and 60-minute sessions are available. We recommend 30 minutes for younger beginners and 60 minutes for older students or those who want to cover more ground each session.',
  },
  {
    question: 'Do I need experience to start?',
    answer:
      'Absolutely no experience needed! We start from the very beginning — learning the basics is part of the fun. Our instructors are experts at making complete beginners feel comfortable and excited to learn.',
  },
  {
    question: 'What makes BasmaWorld different?',
    answer:
      'BasmaWorld uses gamified learning with XP points, skill trees, and our AI music mentor Echo — so learning feels like leveling up in a game. Students earn XP, unlock milestones, and stay motivated far longer than in traditional lessons.',
  },
  {
    question: 'Where are you located?',
    answer:
      'Our studio is at 9205 W Russell Rd Building 3, Las Vegas, NV 89148. We also serve students worldwide through online lessons. Give us a call at (702) 788-7369 or book your trial online.',
  },
]

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 flex-shrink-0 text-purple-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-20">
      {/* Section header */}
      <div className="text-center mb-12">
        <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Got Questions?</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Everything you need to know about BASMA Music Academy. Can't find what you're looking for?{' '}
          <a
            href="https://wa.me/17027887369?text=Hi%20Basma!%20I%27m%20interested%20in%20music%20lessons%20at%20BasmaWorld."
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline transition-colors"
          >
            Chat with us on WhatsApp
          </a>
          .
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-2xl border transition-colors duration-200"
            style={{
              background: openIndex === i ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.03)',
              borderColor: openIndex === i ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)',
            }}
          >
            <button
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl"
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
            >
              <span className="text-white font-semibold text-sm sm:text-base leading-snug">
                {faq.question}
              </span>
              <ChevronIcon open={openIndex === i} />
            </button>

            {/* Animated answer */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: openIndex === i ? '400px' : '0px',
                opacity: openIndex === i ? 1 : 0,
              }}
            >
              <div className="px-5 pb-5 pt-0">
                <div
                  className="h-px mb-4"
                  style={{ background: 'rgba(139,92,246,0.2)' }}
                />
                <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
