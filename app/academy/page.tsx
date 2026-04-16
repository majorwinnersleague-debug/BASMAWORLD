'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AcademyRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/basma/academy')
  }, [router])
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-gray-400 text-lg">Redirecting to BASMA Academy...</p>
    </div>
  )
}
