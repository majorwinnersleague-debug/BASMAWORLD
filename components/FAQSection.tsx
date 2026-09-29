'use client'
import { useState } from 'react'

const faqs = [
  {
    question: 'How much do private music lessons cost?',
    answer:
      'Individual lessons are $45 for 30 minutes or $70 for 60 minutes. Monthly packages paid in advance are $135 for four 30-minute lessons or $200 for four 60-minute lessons.',
  },
  {
    question: 'What ages do you teach?',
    answer:
      'Private lessons are available for students of all ages. Lessons are personalized to the student’s age, experience level, goals, and instrument.',
  },
  {
    question: 'What instruments and skills do you offer?',
    answer:
      'We offer private instruction in voice/singing, piano, guitar, drums, ukulele, recording/production, and other musical interests.',
  },
  {
    question: 'Are lessons in-person or online?',
    answer:
      'We offer in-person private lessons at our Las Vegas studio and can discuss online lesson options when appropriate.',
  },
  {
    question: 'How long is each lesson?',
    answer:
      'You can choose a 30-minute or 60-minute individual lesson. Monthly packages include four lessons of the selected length and are paid in advance.',
  },
  {
    question: 'Do I need experience to start?',
    answer:
      'No experience is required. Lessons are tailored to your starting level and goals, whether you are a complete beginner or continuing your musical development.',
  },
  {
    question: 'What is included with a monthly package?',
    answer:
      'Each monthly package includes four private lessons paid in advance. A 1 makeup lesson is included and must be used by the second week of the following month.',
  },
  {
    question: 'Where are you located?',
    answer:
      'Our private-lesson studio is at 6787 W Tropicana Ave Suite 260, Las Vegas, NV 89103. Call (702) 788-7369 or book through the private lessons page.',
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
