"use client"
import React, {useState, useEffect} from 'react'

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
    <div className="container">
      <h1>Sober Tracker</h1>
      <div className="card green-card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div>
            <div style={{fontSize:48,fontWeight:700}}>{days}</div>
            <div style={{fontSize:14,color:'#064e3b'}}>dagen schoon</div>
            {startDate && <div style={{fontSize:12,color:'#065f46',marginTop:6}}>Gestart: {new Date(startDate).toLocaleDateString()}</div>}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <button onClick={startNow} style={{background:'#16a34a',color:'#fff',border:'none',padding:'8px 12px',borderRadius:6}}>Start</button>
            <button onClick={reset} style={{background:'#dc2626',color:'#fff',border:'none',padding:'8px 12px',borderRadius:6}}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  )
}
