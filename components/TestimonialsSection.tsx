'use client'
import { useState, useEffect, useCallback } from 'react'

const testimonials = [
  {
    stars: 5,
    quote:
      'My daughter went from never singing to performing at her school recital in just 3 months. Basma is an incredible teacher!',
    author: 'Maria L.',
    role: 'Las Vegas parent',
    tag: 'Early Student',
  },
  {
    stars: 5,
    quote:
      'The gamified lessons kept my son engaged like nothing else. He actually ASKS to practice now!',
    author: 'James T.',
    role: 'Parent of 8-year-old',
    tag: 'Early Student',
  },
  {
    stars: 5,
    quote:
      "I'm an adult beginner and felt so welcome. No judgment, just pure encouragement and real results.",
    author: 'Sofia R.',
    role: 'Adult student',
    tag: 'Early Student',
  },
  {
    stars: 5,
    quote:
      'Best music school in Las Vegas hands down. The Echo AI mentor makes it so fun for kids!',
    author: 'David M.',
    role: 'Las Vegas dad',
    tag: 'Early Student',
  },
  {
    stars: 5,
    quote:
      'We tried 2 other music schools before BasmaWorld. Nothing compares. My kids love coming every week.',
    author: 'Aisha K.',
    role: 'Mother of 3',
    tag: 'Early Student',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
          fill="#F59E0B"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [paused, next])

  const t = testimonials[current]

  return (
    <section className="py-20 overflow-hidden" style={{ background: 'rgba(139,92,246,0.04)' }}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">
            What Students Say
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Real Results, Real Families
          </h2>
          <p className="text-gray-500 text-sm">Early students sharing their BasmaWorld experience</p>
        </div>

        {/* Carousel */}
        <div
          className="relative rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(139,92,246,0.25)',
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Quote mark */}
          <div
            className="absolute top-6 left-8 text-7xl leading-none font-serif select-none"
            style={{ color: 'rgba(139,92,246,0.2)' }}
            aria-hidden="true"
          >
            "
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#a78bfa',
              }}
            >
              ✦ {t.tag}
            </span>
          </div>

          <div className="flex justify-center">
            <StarRating count={t.stars} />
          </div>

          <blockquote className="text-gray-200 text-lg sm:text-xl leading-relaxed mb-6 relative z-10 italic">
            "{t.quote}"
          </blockquote>

          <div>
            <p className="text-white font-bold text-base">{t.author}</p>
            <p className="text-gray-500 text-sm">{t.role}</p>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => { prev(); setPaused(true) }}
              aria-label="Previous testimonial"
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPaused(true) }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background: i === current ? '#8B5CF6' : 'rgba(255,255,255,0.2)',
                    transform: i === current ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => { next(); setPaused(true) }}
              aria-label="Next testimonial"
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
