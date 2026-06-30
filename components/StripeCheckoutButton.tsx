'use client'

export default function StripeCheckoutButton() {
  return (
    <a
      href="/enroll"
      className="inline-block bg-[#7B2FBE] hover:bg-[#9333ea]
                 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200
                 shadow-lg shadow-purple-900/50 hover:shadow-purple-600/40 hover:scale-105
                 active:scale-95 border border-purple-500/40"
      style={{
        background: 'linear-gradient(135deg, #7B2FBE 0%, #5b21a0 100%)',
        boxShadow: '0 0 24px rgba(123,47,190,0.4), 0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      🎵 Sign Up for Summer Camp
    </a>
  )
}
