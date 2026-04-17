'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HopesChanceRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/hopes')
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🤝</div>
        <p className="text-green-400 font-semibold text-lg">Redirecting to Hopes Chance...</p>
        <p className="text-gray-500 text-sm mt-2">
          If you are not redirected,{' '}
          <a href="/hopes" className="underline text-green-400 hover:text-green-300">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  )
}
