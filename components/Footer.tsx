export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p className="mb-2">🌍 <strong className="text-white">BasmaWorld</strong> — Music. Community. Opportunity.</p>
        <p>© {new Date().getFullYear()} BASMA LLC · Las Vegas, NV</p>
      </div>
    </footer>
  )
}
