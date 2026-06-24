import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-10 mt-16" style={{ background: '#050505' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3
          className="text-lg font-semibold mb-2 gradient-gold inline-block"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          BasmaWorld
        </h3>
        <p className="text-white/25 text-sm mb-4">Music. Community. Opportunity.</p>

        <div className="flex flex-wrap gap-4 justify-center text-sm text-white/25 mb-6">
          <Link href="/" className="hover:text-white/50 transition-colors">Home</Link>
          <Link href="/enroll" className="hover:text-white/50 transition-colors">Summer Camp</Link>
          <Link href="/private-lessons" className="hover:text-white/50 transition-colors">Private Lessons</Link>
          <Link href="/portal" className="hover:text-white/50 transition-colors">Parent Portal</Link>
          <Link href="/teacher" className="hover:text-white/50 transition-colors">Teacher Portal</Link>
          <Link href="/contact" className="hover:text-white/50 transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center text-sm text-white/20 mb-6">
          <a href="mailto:becomeasingermusicacademy@gmail.com" className="hover:text-white/40 transition-colors">Email</a>
          <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">TikTok</a>
          <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">Instagram</a>
        </div>

        <p className="text-white/10 text-xs">&copy; {new Date().getFullYear()} BASMA LLC · Las Vegas, NV</p>
      </div>
    </footer>
  )
}
