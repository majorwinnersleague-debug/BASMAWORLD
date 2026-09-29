'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

const REASONS=[
  ['Personal reasons','Personal reasons'],
  ['Too expensive','Too expensive'],
  ['Too far','The location is too far'],
  ['Will return','I plan to return later'],
  ['Not interested right now','I am not interested right now'],
  ['Something else','Something else'],
]

export default function UnsubscribePage(){
  const params=useMemo(()=>new URLSearchParams(typeof window!=='undefined'?window.location.search:''),[])
  const email=params.get('email') || ''
  const [reason,setReason]=useState('')
  const [confirming,setConfirming]=useState(false)
  const [loading,setLoading]=useState(false)
  const [done,setDone]=useState(false)
  const [error,setError]=useState('')

  async function submit(confirm=false){
    setError('')
    if(!reason){setError('Please select a reason.');return}
    setLoading(true)
    try{
      const res=await fetch('/api/unsubscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,reason,confirm})})
      const data=await res.json()
      if(!res.ok) throw new Error(data.error || 'Please try again.')
      if(data.needsConfirmation){setConfirming(true)}
      else setDone(true)
    }catch(e:any){setError(e.message)}
    setLoading(false)
  }

  if(done) return <main className="min-h-screen bg-[#0D0118] text-white flex items-center justify-center px-6"><div className="max-w-lg text-center"><div className="text-4xl mb-5">✓</div><h1 className="text-3xl font-bold mb-4">You're unsubscribed.</h1><p className="text-white/60 leading-7 mb-8">You won't receive BASMA Academy emails and event updates from this list.</p><Link href="/" className="inline-block px-7 py-3 rounded-full font-bold" style={{background:'linear-gradient(135deg,#c9a84c,#FFE07A)',color:'#0D0118'}}>Return to BASMAWorld</Link></div></main>

  return <main className="min-h-screen bg-[#0D0118] text-white flex items-center justify-center px-6 py-12">
    <div className="w-full max-w-2xl">
      <div className="text-center mb-8"><p className="text-[#F0C850] font-bold tracking-[.25em] text-sm">B.A.S.M.A.</p><h1 className="text-3xl md:text-4xl font-bold mt-3">Before you go…</h1><p className="text-white/55 mt-3">We'd love to know what changed. This helps us make BASMAWorld more useful.</p></div>
      <div className="rounded-2xl p-7 md:p-9" style={{background:'linear-gradient(135deg,#1a0d30,#2D1B4E)',border:'1px solid rgba(240,200,80,.2)'}}>
        {!confirming ? <>
          <h2 className="text-xl font-bold mb-5">Why are you unsubscribing?</h2>
          <div className="grid gap-3">{REASONS.map(([value,label])=><label key={value} className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[.03] cursor-pointer"><input type="radio" name="reason" value={value} checked={reason===value} onChange={e=>setReason(e.target.value)}/><span>{label}</span></label>)}</div>
          {error&&<p className="text-red-300 text-sm mt-4">{error}</p>}
          <button disabled={loading} onClick={()=>submit(false)} className="w-full mt-6 py-3 rounded-xl font-bold" style={{background:'linear-gradient(135deg,#c9a84c,#FFE07A)',color:'#0D0118'}}>{loading?'Saving…':'Continue'}</button>
        </> : <>
          <h2 className="text-xl font-bold mb-4">Before you cancel your BASMAWorld updates</h2>
          <p className="text-white/70 leading-7">If price is part of the reason, our monthly private-lesson packages are our best deal:</p>
          <div className="my-5 rounded-xl p-5 bg-white/[.05] border border-[#c9a84c]/20"><p className="text-[#F0C850] font-bold">4 × 30-minute private lessons — $135/month</p><p className="text-[#F0C850] font-bold mt-2">4 × 60-minute private lessons — $200/month</p><p className="text-white/50 text-sm mt-2">Paid in advance. Private lessons only.</p></div>
          <p className="text-white/70 leading-7">We also occasionally share special BASMA opportunities and events with our community, including student experiences and event tickets when available.</p>
          <p className="text-white font-semibold mt-5">Are you sure you want to unsubscribe from events and information regarding BASMAWorld.com?</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6"><button disabled={loading} onClick={()=>setConfirming(false)} className="flex-1 py-3 rounded-xl border border-white/15 text-white/80">Keep me subscribed</button><button disabled={loading} onClick={()=>submit(true)} className="flex-1 py-3 rounded-xl font-bold border border-white/10" style={{background:'rgba(255,255,255,.08)'}}>Yes, unsubscribe</button></div>
        </>}
      </div>
      <p className="text-center text-white/25 text-xs mt-5">BASMA Academy · Las Vegas, NV</p>
    </div>
  </main>
}
