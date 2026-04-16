'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">⚠️ Something went wrong</h1>
      <p className="text-gray-400 mb-8">{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full transition">Try again</button>
    </div>
  )
}
