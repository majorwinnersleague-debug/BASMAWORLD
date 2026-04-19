'use client'
import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-40 w-10 h-10 bg-[#8B5CF6]/80 hover:bg-[#8B5CF6] 
                 text-white rounded-full flex items-center justify-center shadow-lg 
                 transition-all hover:scale-110 backdrop-blur-sm border border-[#8B5CF6]/30"
      aria-label="Back to top"
    >
      ↑
    </button>
  )
}
