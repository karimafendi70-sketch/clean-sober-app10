"use client"
import React, {useState, useEffect} from 'react'
import Link from 'next/link'

function daysBetween(startISO: string | null){
  if(!startISO) return 0
  const start = new Date(startISO)
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000*60*60*24))
  return diff >= 0 ? diff : 0
}

export default function Home(){
  const [startDate, setStartDate] = useState<string | null>(null)
  const [days, setDays] = useState<number>(0)

  useEffect(()=>{
    const stored = localStorage.getItem('sober.startDate')
    if(stored) setStartDate(stored)
  },[])

  useEffect(()=>{
    setDays(daysBetween(startDate))
    const id = setInterval(()=> setDays(daysBetween(startDate)), 1000*60*60) // update hourly
    return ()=> clearInterval(id)
  },[startDate])

  const startNow = ()=>{
    const iso = new Date().toISOString()
    localStorage.setItem('sober.startDate', iso)
    setStartDate(iso)
  }

  const reset = ()=>{
    localStorage.removeItem('sober.startDate')
    setStartDate(null)
    setDays(0)
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',padding:'20px',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{maxWidth:'500px',width:'100%'}}>
        {/* Header */}
        <h1 style={{textAlign:'center',color:'#064e3b',fontSize:'32px',marginBottom:'30px'}}>Sober Tracker</h1>

        {/* Main Card */}
        <div style={{background:'white',borderRadius:'16px',padding:'40px',boxShadow:'0 20px 60px rgba(0,0,0,0.1)',marginBottom:'20px'}}>
          {/* Days Counter */}
          <div style={{textAlign:'center',marginBottom:'30px'}}>
            <div style={{fontSize:'72px',fontWeight:'800',color:'#16a34a',lineHeight:'1'}}>{days}</div>
            <p style={{fontSize:'18px',color:'#6b7280',marginTop:'8px'}}>dagen schoon 🌟</p>
            {startDate && (
              <p style={{fontSize:'12px',color:'#9ca3af',marginTop:'8px'}}>
                Gestart: <span style={{fontWeight:'600',color:'#16a34a'}}>{new Date(startDate).toLocaleDateString('nl-NL')}</span>
              </p>
            )}
          </div>

          {/* Buttons */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            <button 
              onClick={startNow}
              style={{padding:'16px',background:'#16a34a',color:'white',border:'none',borderRadius:'10px',fontWeight:'600',fontSize:'16px',cursor:'pointer',transition:'all 0.3s'}}
              onMouseEnter={e => {const el = e.target as HTMLButtonElement; el.style.background='#15803d'; el.style.transform='translateY(-4px)'; el.style.boxShadow='0 8px 20px rgba(22,163,74,0.3)'}}
              onMouseLeave={e => {const el = e.target as HTMLButtonElement; el.style.background='#16a34a'; el.style.transform='translateY(0)'; el.style.boxShadow='none'}}
            >
              ▶ Start
            </button>
            <button 
              onClick={reset}
              style={{padding:'16px',background:'#fee2e2',color:'#991b1b',border:'none',borderRadius:'10px',fontWeight:'600',fontSize:'16px',cursor:'pointer',transition:'all 0.3s'}}
              onMouseEnter={e => {const el = e.target as HTMLButtonElement; el.style.background='#fecaca'; el.style.transform='translateY(-4px)'; el.style.boxShadow='0 8px 20px rgba(220,38,38,0.2)'}}
              onMouseLeave={e => {const el = e.target as HTMLButtonElement; el.style.background='#fee2e2'; el.style.transform='translateY(0)'; el.style.boxShadow='none'}}
            >
              ↻ Reset
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div style={{textAlign:'center'}}>
          <Link href="/login" style={{display:'inline-block',padding:'12px 24px',background:'rgba(255,255,255,0.6)',color:'#064e3b',borderRadius:'10px',fontWeight:'600',textDecoration:'none',transition:'all 0.3s',border:'2px solid rgba(22,163,74,0.2)',boxSizing:'border-box'}}
            onMouseEnter={e => {const el = e.target as HTMLAnchorElement; el.style.background='white'; el.style.transform='translateY(-2px)'; el.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'}}
            onMouseLeave={e => {const el = e.target as HTMLAnchorElement; el.style.background='rgba(255,255,255,0.6)'; el.style.transform='translateY(0)'; el.style.boxShadow='none'}}
          >
            → Inloggen
          </Link>
        </div>
      </div>
    </div>
  )
}
