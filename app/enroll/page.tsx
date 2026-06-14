import type { Metadata } from 'next'
import { Suspense } from 'react'
import EnrollContent from './EnrollContent'

export const metadata: Metadata = {
  title: 'Enroll — BASMA Summer Classes 2026',
  description: 'Enroll in BASMA Summer Music Classes. Piano, voice, performance & dance for ages 2–17. July & August in Las Vegas.',
}

export default function EnrollPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#050505',color:'#c9a84c',fontSize:'18px'}}>Loading enrollment...</div>}>
      <EnrollContent />
    </Suspense>
  )
}
