import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition">
          🌍 BasmaWorld
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/academy" className="text-gray-300 hover:text-purple-400 transition">🎵 Academy</Link>
          <Link href="/mwl" className="text-gray-300 hover:text-yellow-400 transition">🏆 MWL</Link>
          <Link href="/hopes" className="text-gray-300 hover:text-green-400 transition">🤝 Hopes Chance</Link>
        </div>
      </div>
    </nav>
  )
}
