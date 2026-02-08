'use client'
import React, {useState, useEffect} from 'react'
import { getSupabase } from '../../lib/supabaseClient'

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
  const [saving, setSaving] = useState(false)

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

  async function startNow(){
    const iso = new Date().toISOString()
    setStartDate(iso)
    setSaving(true)
    try{
      const supabase: any = getSupabase()
      const user = await supabase.auth.getUser()
      if(user.data?.user){
        await supabase.from('sober_entries').insert<any>({ user_id: user.data.user.id, start_date: iso, days: 0 })
      }
    }catch(e){
      // ignore; still save locally
    }
    setSaving(false)
  }

  async function resetAll(){
    setStartDate(null)
    setManualDays(0)
    setSaving(true)
    try{
      const supabase: any = getSupabase()
      const user = await supabase.auth.getUser()
      if(user.data?.user){
        await supabase.from('sober_entries').insert<any>({ user_id: user.data.user.id, start_date: new Date().toISOString(), days: 0 })
      }
    }catch(e){ }
    setSaving(false)
  }

  return (
    <div>
      <p style={{fontSize:18}}><strong>Days sober:</strong> {computedDays}</p>

      <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
        <label style={{display:'flex',alignItems:'center',gap:8}}>
          Start date:
          <input type="date" value={startDate ? startDate.split('T')[0] : ''} onChange={e=>setStartDate(e.target.value? new Date(e.target.value).toISOString():null)} />
        </label>

        <button onClick={resetAll} disabled={saving} style={{background:'#dc2626',color:'#fff',border:'none',padding:'8px 12px',borderRadius:6}}>Reset</button>

        <label style={{display:'flex',alignItems:'center',gap:8}}>
          Manual days:
          <input type="number" min={0} value={manualDays ?? ''} onChange={e=>setManualDays(e.target.value?Number(e.target.value):null)} />
        </label>

        <button onClick={startNow} disabled={saving} style={{background:'#16a34a',color:'#fff',border:'none',padding:'8px 12px',borderRadius:6}}>Start</button>
      </div>

      <p style={{marginTop:12,fontSize:12,color:'#666'}}>Tip: set a start date to track automatically, or enter manual days.</p>
    </div>
  )
}
