'use client'

const plans = [
  {
    name: 'July — All Classes',
    price: '$25',
    period: '/day',
    features: ['Tiny Tots, Kids Music, Piano, Recording', 'Mon – Thu at Synergy Dance', '15% off weekly · 25% off monthly'],
    highlight: true,
    badge: 'Summer Special',
  },
  {
    name: 'August — Tiered',
    price: '$25–$40',
    period: '/day',
    features: ['Tiny Tots $25 · Kids Music $30', 'Piano $35 · Recording $40', '$5 off each additional child'],
    highlight: false,
  },
]

export default function PricingSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Pricing</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Summer Camp Pricing</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Enroll today — classes Mon–Thu at Synergy Dance.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 border text-center ${
              plan.highlight
                ? 'border-purple-500/50 bg-purple-500/5'
                : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            {plan.badge && (
              <span className="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {plan.badge}
              </span>
            )}
            <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-4xl font-bold text-white mb-1">{plan.price}</p>
            <p className="text-gray-400 text-sm mb-4">{plan.period}</p>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <a
              href="/enroll"
              className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-full text-sm transition"
            >
              Sign Up →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
