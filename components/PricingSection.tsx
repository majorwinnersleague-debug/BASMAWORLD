import Link from 'next/link'
import StripeCheckoutButton from '@/components/StripeCheckoutButton'

export default function PricingSection() {
  const plans = [
    {
      name: 'Trial Lesson',
      price: '$29',
      period: 'one time',
      desc: 'Your first lesson — risk free.',
      features: [
        '30-minute 1-on-1 session',
        'Voice or instrument assessment',
        'Personalized 90-day roadmap',
        'Meet your coach',
        'No commitment required',
      ],
      cta: 'Book Trial Now',
      highlight: true,
      color: 'border-[#8B5CF6]',
      badge: 'Most Popular',
    },
    {
      name: 'Monthly',
      price: '$149',
      period: 'per month',
      desc: 'Consistent weekly lessons.',
      features: [
        '4 lessons per month',
        '30-minute sessions',
        'XP tracking & skill tree',
        'Practice assignments',
        'Cancel anytime',
      ],
      cta: 'Get Started',
      highlight: false,
      color: 'border-white/10',
      badge: null,
    },
    {
      name: 'Intensive',
      price: '$249',
      period: 'per month',
      desc: 'Fast-track your progress.',
      features: [
        '8 lessons per month',
        '60-minute sessions',
        'Priority scheduling',
        'Performance coaching',
        'Gateway Festival prep',
      ],
      cta: 'Get Started',
      highlight: false,
      color: 'border-[#F59E0B]/30',
      badge: 'Best Value',
    },
  ]

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-[#8B5CF6] font-semibold uppercase tracking-widest text-xs mb-3">Pricing</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Simple, Transparent Pricing</h2>
        <p className="text-white/40 max-w-md mx-auto text-sm">
          Start with a $29 trial. No contracts, no pressure. Just music.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative border ${plan.color} bg-white/[0.02] rounded-2xl p-6 flex flex-col ${plan.highlight ? 'shadow-lg shadow-purple-900/20' : ''}`}>
            {plan.badge && (
              <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${plan.highlight ? 'bg-[#8B5CF6] text-white' : 'bg-[#F59E0B] text-black'}`}>
                {plan.badge}
              </span>
            )}
            <div className="mb-6">
              <h3 className="font-bold text-white text-lg mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-white/30 text-sm">/{plan.period}</span>
              </div>
              <p className="text-white/40 text-sm">{plan.desc}</p>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                  <span className="text-[#22C55E] flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {plan.highlight ? (
              <StripeCheckoutButton />
            ) : (
              <Link
                href="/academy"
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition
                  ${plan.name === 'Intensive' 
                    ? 'bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B]' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/70'}`}
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-white/20 text-xs mt-6">
        All prices in USD · In-person (Las Vegas) or online · (702) 788-7369
      </p>
    </section>
  )
}
