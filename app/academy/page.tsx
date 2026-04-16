export default function Academy() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-purple-400 mb-4">🎵 BASMA Music Academy</h1>
      <p className="text-gray-300 text-lg mb-8">Level up your music skills. Earn XP. Unlock your Skill Tree.</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-purple-900/40 rounded-2xl p-6 border border-purple-700">
          <h2 className="text-xl font-bold mb-2">🎸 Music Path</h2>
          <p className="text-gray-400">Core instrument & theory lessons</p>
        </div>
        <div className="bg-purple-900/40 rounded-2xl p-6 border border-purple-700">
          <h2 className="text-xl font-bold mb-2">🎨 Branding Path</h2>
          <p className="text-gray-400">Music marketing & personal brand</p>
        </div>
        <div className="bg-purple-900/40 rounded-2xl p-6 border border-purple-700">
          <h2 className="text-xl font-bold mb-2">💚 Health Path</h2>
          <p className="text-gray-400">Artist wellness & performance mindset</p>
        </div>
      </div>
    </main>
  )
}
