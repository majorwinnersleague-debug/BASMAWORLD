'use client'

const plans = [
  {
    name: '30-Minute Individual Lesson',
    price: '$45',
    period: '/ lesson',
    features: ['One-on-one private instruction', 'Personalized goals and repertoire', 'In-person or online options'],
    highlight: false,
  },
  {
    name: '60-Minute Individual Lesson',
    price: '$70',
    period: '/ lesson',
    features: ['One-on-one private instruction', 'More time for technique and repertoire', 'In-person or online options'],
    highlight: false,
  },
  {
    name: '4 × 30-Minute Monthly Package',
    price: '$135',
    period: '/ month',
    features: ['Four private 30-minute lessons', 'Paid in advance', '1 makeup lesson included'],
    highlight: true,
    badge: 'Monthly Package',
  },
  {
    name: '4 × 60-Minute Monthly Package',
    price: '$200',
    period: '/ month',
    features: ['Four private 60-minute lessons', 'Paid in advance', '1 makeup lesson included'],
    highlight: false,
  },
]

export default function PricingSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Private Lesson Pricing</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">One-on-One Music Lessons</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Choose an individual lesson or a monthly package paid in advance.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
              href="/private-lessons"
              className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-full text-sm transition"
            >
              Book a Lesson →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
