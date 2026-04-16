export default function HopesChance() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-green-400 mb-4">🤝 Hopes Chance</h1>
      <p className="text-gray-300 text-lg mb-8">Find resources for housing, jobs, mental health & more. Free. Confidential. No judgment.</p>
      <div className="bg-green-900/20 border border-green-700 rounded-2xl p-6 max-w-xl">
        <h2 className="text-xl font-bold mb-4">What do you need help with?</h2>
        <div className="flex flex-wrap gap-2">
          {['Housing', 'Food', 'Mental Health', 'Jobs', 'Healthcare', 'Legal', 'Education', 'Transportation'].map(need => (
            <button key={need} className="bg-green-800/50 hover:bg-green-700 border border-green-600 px-4 py-2 rounded-full text-sm transition">
              {need}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
