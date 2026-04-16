export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">BasmaWorld</h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8">Music. Community. Opportunity.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/academy" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold transition">🎵 Music Academy</a>
          <a href="/mwl" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full font-semibold transition">🏆 Major Winners League</a>
          <a href="/hopes" className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full font-semibold transition">🤝 Hopes Chance</a>
        </div>
      </section>
    </main>
  )
}
