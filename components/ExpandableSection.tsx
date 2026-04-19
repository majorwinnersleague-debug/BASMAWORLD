'use client'
import { useState } from 'react'

export default function ExpandableSection({
  title,
  preview,
  children,
  icon,
  accentColor = '#8B5CF6',
  defaultOpen = false,
}: {
  title: string
  preview: string
  children: React.ReactNode
  icon?: string
  accentColor?: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="border rounded-2xl transition-all duration-300 overflow-hidden"
      style={{ borderColor: open ? `${accentColor}40` : 'rgba(255,255,255,0.1)', background: open ? `${accentColor}08` : 'rgba(255,255,255,0.02)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-6 text-left group"
        aria-expanded={open}
      >
        {icon && <span className="text-3xl mt-0.5 shrink-0">{icon}</span>}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white group-hover:opacity-80 transition">{title}</h3>
          <p className="text-white/40 text-sm mt-1 leading-relaxed">{preview}</p>
        </div>
        <span
          className="text-white/30 text-xl shrink-0 transition-transform duration-300 mt-1"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open ? '2000px' : '0px',
          opacity: open ? 1 : 0,
          overflow: 'hidden',
        }}
      >
        <div className="px-6 pb-6 pt-0">{children}</div>
      </div>
    </div>
  )
}
