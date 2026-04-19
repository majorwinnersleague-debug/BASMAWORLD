'use client'

interface PackageTier {
  name: string
  price: string
  period: string
  features: string[]
  highlight?: boolean
  badge?: string
}

export default function BotPackageCard({
  botName,
  botEmoji,
  description,
  accentColor,
  tiers,
}: {
  botName: string
  botEmoji: string
  description: string
  accentColor: string
  tiers: PackageTier[]
}) {
  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <span className="text-4xl">{botEmoji}</span>
        <h3 className="text-xl font-bold text-white mt-2">{botName}</h3>
        <p className="text-white/40 text-sm mt-1 max-w-lg mx-auto">{description}</p>
        <div
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mt-3 uppercase tracking-wider"
          style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
        >
          ⚡ AI-Powered · Coming Soon
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="rounded-xl p-5 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: tier.highlight ? `${accentColor}10` : 'rgba(255,255,255,0.02)',
              border: tier.highlight ? `2px solid ${accentColor}50` : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {tier.badge && (
              <span
                className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3 uppercase"
                style={{ background: accentColor, color: '#000' }}
              >
                {tier.badge}
              </span>
            )}
            <h4 className="text-base font-bold text-white">{tier.name}</h4>
            <div className="mt-2 mb-4">
              <span className="text-2xl font-bold" style={{ color: accentColor }}>{tier.price}</span>
              <span className="text-white/30 text-sm ml-1">{tier.period}</span>
            </div>
            <ul className="space-y-2">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                  <span style={{ color: accentColor }} className="mt-0.5 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
