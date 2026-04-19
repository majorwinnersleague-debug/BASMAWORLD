'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-6xl">🪆</div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Billy tripped over his strings.</h2>
        <p className="text-white/40 max-w-sm">Something went wrong on our end. Don&apos;t worry — it&apos;s not your fault!</p>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl font-medium transition"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-white/20 hover:border-white/40 text-white/60 hover:text-white px-6 py-2.5 rounded-xl font-medium transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
