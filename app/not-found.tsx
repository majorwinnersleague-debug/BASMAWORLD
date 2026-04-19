import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-gray-400 text-xl mb-8">This page doesn't exist yet.</p>
      <Link href="/" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full transition">Back to BasmaWorld</Link>
    </div>
  )
}
