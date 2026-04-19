'use client'
import { useState } from 'react'

const HOPES_URL = 'https://basmaworld.com/hopes'

const shareLinks = [
  {
    label: 'Facebook',
    color: '#1877F2',
    hoverColor: '#1565D8',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(HOPES_URL)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    color: '#000000',
    hoverColor: '#1a1a1a',
    url: `https://twitter.com/intent/tweet?text=Free%20resource%20navigator%20for%20Las%20Vegas%20youth!%20Check%20out%20Hopes%20Chance&url=${encodeURIComponent(HOPES_URL)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    color: '#25D366',
    hoverColor: '#1ebe59',
    url: `https://wa.me/?text=Check%20out%20Hopes%20Chance%20-%20free%20resources%20for%20Las%20Vegas%20youth%3A%20${encodeURIComponent(HOPES_URL)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
]

export default function ShareButtons() {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(HOPES_URL)
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement('textarea')
      el.value = HOPES_URL
      el.style.position = 'fixed'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <div
        className="rounded-2xl p-6 sm:p-8 text-center"
        style={{
          background: 'rgba(139,92,246,0.06)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Know someone who needs help? Share Hopes Chance 💜
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Help us reach more youth in Las Vegas who need free support resources.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Social share buttons */}
          {shareLinks.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${s.label}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold transition-all duration-150 hover:scale-105 active:scale-95"
              style={{ background: s.color }}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </a>
          ))}

          {/* Copy link button */}
          <button
            onClick={copyLink}
            aria-label="Copy link to clipboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              background: copied ? '#22C55E' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                <span className="hidden sm:inline">Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
