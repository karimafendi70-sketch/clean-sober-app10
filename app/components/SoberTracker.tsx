'use client'
import React, {useState, useEffect} from 'react'

function daysSince(dateStr: string | null){
  if(!dateStr) return 0
  const start = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000*60*60*24))
  return diff >= 0 ? diff : 0
}

export default function SoberTracker(){
  const [startDate, setStartDate] = useState<string | null>(null)
  const [manualDays, setManualDays] = useState<number | null>(null)

  useEffect(()=>{
    const d = localStorage.getItem('sober.startDate')
    const m = localStorage.getItem('sober.manualDays')
    if(d) setStartDate(d)
    if(m) setManualDays(Number(m))
  },[])

  useEffect(()=>{
    if(startDate) localStorage.setItem('sober.startDate', startDate)
    else localStorage.removeItem('sober.startDate')
  },[startDate])

  useEffect(()=>{
    if(manualDays !== null) localStorage.setItem('sober.manualDays', String(manualDays))
    else localStorage.removeItem('sober.manualDays')
  },[manualDays])

  const computedDays = startDate ? daysSince(startDate) : (manualDays ?? 0)

  return (
    <div>
      <p><strong>Days sober:</strong> {computedDays}</p>

      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <label style={{display:'flex',alignItems:'center',gap:8}}>
          Start date:
          <input type="date" value={startDate ?? ''} onChange={e=>setStartDate(e.target.value||null)} />
        </label>

        <button onClick={()=>{setStartDate(null); setManualDays(0)}}>Reset</button>

        <label style={{display:'flex',alignItems:'center',gap:8}}>
          Manual days:
          <input type="number" min={0} value={manualDays ?? ''} onChange={e=>setManualDays(e.target.value?Number(e.target.value):null)} />
        </label>
      </div>

      <p style={{marginTop:12,fontSize:12,color:'#666'}}>Tip: set a start date to track automatically, or enter manual days.</p>
    </div>
  )
}
