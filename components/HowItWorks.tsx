export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      emoji: '📅',
      title: 'Book Your $29 Trial',
      desc: 'Choose your instrument and preferred time. In-person in Las Vegas or online from anywhere in the world.',
      color: 'text-[#8B5CF6]',
    },
    {
      step: '02',
      emoji: '🎯',
      title: 'Get Your Assessment',
      desc: 'Basma evaluates your current level, your goals, and builds your personalized 90-day roadmap.',
      color: 'text-[#F59E0B]',
    },
    {
      step: '03',
      emoji: '🎮',
      title: 'Level Up with XP',
      desc: 'Earn XP for every practice session. Unlock skills on your tree. Track your progress like a game.',
      color: 'text-[#22C55E]',
    },
    {
      step: '04',
      emoji: '🎤',
      title: 'Perform on Stage',
      desc: 'At 90 days, you perform. Whether at a recital, the Gateway Festival, or your first TikTok — you ship.',
      color: 'text-[#EC4899]',
    },
  ]

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-[#8B5CF6] font-semibold uppercase tracking-widest text-xs mb-3">The Process</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <div key={s.step} className="relative">
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-full w-full h-px bg-white/10 z-0" style={{width:'calc(100% - 2rem)'}} />
            )}
            <div className="relative z-10 bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center hover:border-white/20 transition">
              <div className={`text-xs font-bold ${s.color} mb-2`}>{s.step}</div>
              <div className="text-3xl mb-3">{s.emoji}</div>
              <h3 className="font-bold text-white text-sm mb-2">{s.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
