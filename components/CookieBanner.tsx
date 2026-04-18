'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('basma_cookies_accepted')
    if (!accepted) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('basma_cookies_accepted', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md 
                    border-t border-white/10 px-4 py-4 flex flex-col sm:flex-row 
                    items-center justify-between gap-3">
      <p className="text-white/50 text-sm text-center sm:text-left max-w-xl">
        We use cookies to improve your experience. By using BasmaWorld you agree to our use of analytics.
        <Link href="/hopes" className="text-[#8B5CF6] hover:text-[#A78BFA] ml-1 transition">Learn more</Link>
      </p>
      <button
        onClick={accept}
        className="flex-shrink-0 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm 
                   font-semibold px-5 py-2 rounded-lg transition"
      >
        Got it
      </button>
    </div>
  )
}
