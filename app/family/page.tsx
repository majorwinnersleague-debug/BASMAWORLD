import type { Metadata } from 'next'
import { Suspense } from 'react'
import FamilyContent from './FamilyContent'

export const metadata: Metadata = {
  title: 'Update My Family — BASMA Academy',
  description: 'View and update your family registration at BASMA Academy. Add siblings, fix info, and complete registration.',
}

export default function FamilyPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#050505',color:'#c9a84c',fontSize:'18px'}}>Loading...</div>}>
      <FamilyContent />
    </Suspense>
  )
}
