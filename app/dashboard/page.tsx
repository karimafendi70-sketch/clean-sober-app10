'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [soberData, setSoberData] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      // Load sober entries from Supabase
      loadSoberData()
    }
  }, [user])

  async function loadSoberData() {
    try {
      const { getSupabase } = await import('@/lib/supabaseClient')
      const supabase: any = getSupabase()
      const { data, error } = await supabase
        .from('sober_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setSoberData(data)
    } catch (e) {
      console.error('Failed to load sober data:', e)
    } finally {
      setLoadingData(false)
    }
  }

  if (loading || !user) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'}}>
        <p style={{color:'#064e3b',fontSize:'18px'}}>Laden...</p>
      </div>
    )
  }

  const currentStreak = soberData && soberData.length > 0 
    ? Math.floor((new Date().getTime() - new Date(soberData[0].start_date).getTime()) / (1000*60*60*24))
    : 0

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',padding:'20px'}}>
      <div style={{maxWidth:'800px',margin:'0 auto'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'30px'}}>
          <h1 style={{color:'#064e3b',fontSize:'32px',margin:0}}>📊 Dashboard</h1>
          <Link href="/" style={{padding:'8px 16px',background:'rgba(255,255,255,0.7)',color:'#064e3b',borderRadius:'8px',fontSize:'14px',fontWeight:'600',textDecoration:'none',transition:'all 0.2s'}}
            onMouseEnter={e => {const el = e.target as HTMLAnchorElement; el.style.background='white'; el.style.transform='translateY(-2px)'}}
            onMouseLeave={e => {const el = e.target as HTMLAnchorElement; el.style.background='rgba(255,255,255,0.7)'; el.style.transform='translateY(0)'}}
          >
            ← Terug
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'20px',marginBottom:'30px'}}>
          <div style={{background:'white',borderRadius:'12px',padding:'24px',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <p style={{color:'#6b7280',fontSize:'14px',margin:'0 0 8px 0'}}>Huidige Streak</p>
            <p style={{color:'#16a34a',fontSize:'36px',fontWeight:'800',margin:0}}>{currentStreak}</p>
            <p style={{color:'#9ca3af',fontSize:'12px',margin:'4px 0 0 0'}}>dagen</p>
          </div>

          <div style={{background:'white',borderRadius:'12px',padding:'24px',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <p style={{color:'#6b7280',fontSize:'14px',margin:'0 0 8px 0'}}>Totaal Entries</p>
            <p style={{color:'#2563eb',fontSize:'36px',fontWeight:'800',margin:0}}>{soberData?.length || 0}</p>
            <p style={{color:'#9ca3af',fontSize:'12px',margin:'4px 0 0 0'}}>keer gereset</p>
          </div>

          <div style={{background:'white',borderRadius:'12px',padding:'24px',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <p style={{color:'#6b7280',fontSize:'14px',margin:'0 0 8px 0'}}>Milestone</p>
            <p style={{color:'#f59e0b',fontSize:'36px',fontWeight:'800',margin:0}}>
              {currentStreak >= 365 ? '🏆' : currentStreak >= 180 ? '🥈' : currentStreak >= 90 ? '🥉' : currentStreak >= 30 ? '⭐' : '🌱'}
            </p>
            <p style={{color:'#9ca3af',fontSize:'12px',margin:'4px 0 0 0'}}>
              {currentStreak >= 365 ? '1 jaar!' : currentStreak >= 180 ? '6 maanden' : currentStreak >= 90 ? '3 maanden' : currentStreak >= 30 ? '1 maand' : 'Begin'}
            </p>
          </div>
        </div>

        {/* Recent Entries */}
        <div style={{background:'white',borderRadius:'12px',padding:'24px',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#064e3b',fontSize:'20px',margin:'0 0 16px 0'}}>Recente Geschiedenis</h2>
          {loadingData ? (
            <p style={{color:'#6b7280'}}>Laden...</p>
          ) : soberData && soberData.length > 0 ? (
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {soberData.map((entry: any, idx: number) => (
                <div key={entry.id} style={{padding:'12px',background:'#f9fafb',borderRadius:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <p style={{margin:0,color:'#374151',fontWeight:'600'}}>
                      {idx === 0 ? '🔥 Huidige streak' : `Reset ${idx}`}
                    </p>
                    <p style={{margin:'4px 0 0 0',color:'#6b7280',fontSize:'12px'}}>
                      Gestart: {new Date(entry.start_date).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <p style={{margin:0,color:'#16a34a',fontSize:'24px',fontWeight:'800'}}>
                    {Math.floor((new Date().getTime() - new Date(entry.start_date).getTime()) / (1000*60*60*24))}d
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{color:'#6b7280'}}>Nog geen entries — start je eerste streak op de homepage!</p>
          )}
        </div>
      </div>
    </div>
  )
}
