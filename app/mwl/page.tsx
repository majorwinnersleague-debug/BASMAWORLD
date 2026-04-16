export default function MWL() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">🏆 Major Winners League</h1>
      <p className="text-gray-300 text-lg mb-8">Content agency & marketing that gets results. Let's grow your brand.</p>
      <div className="bg-yellow-900/20 border border-yellow-700 rounded-2xl p-6 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Work with us</h2>
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Your Name" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <input type="email" placeholder="Email Address" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <input type="text" placeholder="Company / Brand" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <textarea placeholder="Tell us about your project..." className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-28" />
          <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition">Submit Inquiry</button>
        </form>
      </div>
    </main>
  )
}
