"use client"
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [emailReminders, setEmailReminders] = useState(true)
  const [reminderTime, setReminderTime] = useState('09:00')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [testingSend, setTestingSend] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
    
    // Load preferences from localStorage
    const prefs = localStorage.getItem('notification-prefs')
    if (prefs) {
      try {
        const data = JSON.parse(prefs)
        setEmailReminders(data.emailReminders ?? true)
        setReminderTime(data.reminderTime ?? '09:00')
      } catch (e) {
        console.error('Failed to parse preferences:', e)
      }
    }
  }, [user])

  const savePreferences = () => {
    setSaving(true)
    setMessage(null)

    const prefs = {
      emailReminders,
      reminderTime,
      email
    }

    localStorage.setItem('notification-prefs', JSON.stringify(prefs))
    
    setTimeout(() => {
      setSaving(false)
      setMessage('✓ Instellingen opgeslagen!')
      setTimeout(() => setMessage(null), 3000)
    }, 500)
  }

  const sendTestEmail = async () => {
    if (!email) {
      setMessage('✗ Vul je email adres in')
      return
    }

    setTestingSend(true)
    setMessage(null)

    try {
      // Get current streak days from localStorage
      const soberDate = localStorage.getItem('soberStartDate')
      let days = 0
      
      if (soberDate) {
        const start = new Date(soberDate)
        const now = new Date()
        days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      }

      const response = await fetch('/api/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, days })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage('✓ Test email verstuurd! Check je inbox.')
      } else {
        setMessage(`✗ ${data.error || data.message || 'Kon email niet versturen'}`)
      }
    } catch (error: any) {
      setMessage(`✗ ${error.message || 'Er ging iets mis'}`)
    } finally {
      setTestingSend(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  if (loading) {
    return (
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <p style={{color:'var(--text-secondary)'}}>Laden...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)',
      padding:'20px'
    }}>
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
        
        {/* Header */}
        <div style={{marginBottom:'20px'}}>
          <Link 
            href="/dashboard" 
            style={{
              color:'var(--text-primary)', 
              textDecoration:'none', 
              fontSize:'14px',
              display:'flex',
              alignItems:'center',
              gap:'4px'
            }}
          >
            ← Terug naar dashboard
          </Link>
        </div>

        <div style={{
          background:'var(--card-bg)',
          borderRadius:'16px',
          padding:'40px',
          boxShadow:'0 10px 40px rgba(0,0,0,0.1)'
        }}>
          
          <h1 style={{
            color:'var(--text-primary)',
            marginBottom:'8px',
            fontSize:'28px'
          }}>
            Instellingen
          </h1>
          <p style={{color:'var(--text-secondary)', marginBottom:'32px'}}>
            Beheer je notificaties en voorkeuren
          </p>

          {/* Email Address */}
          <div style={{marginBottom:'24px'}}>
            <label style={{
              display:'block',
              color:'var(--text-primary)',
              fontWeight:'600',
              marginBottom:'8px'
            }}>
              Email adres
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jouw@email.com"
              style={{
                width:'100%',
                padding:'12px',
                border:'1px solid var(--border-color)',
                borderRadius:'8px',
                fontSize:'14px',
                background:'var(--card-bg)',
                color:'var(--text-primary)'
              }}
            />
            <p style={{fontSize:'12px', color:'var(--text-muted)', marginTop:'6px'}}>
              Je email adres voor het ontvangen van reminders
            </p>
          </div>

          {/* Email Reminders Toggle */}
          <div style={{
            padding:'16px',
            background:'var(--bg-secondary)',
            borderRadius:'10px',
            marginBottom:'20px'
          }}>
            <label style={{
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between',
              cursor:'pointer'
            }}>
              <div>
                <div style={{
                  color:'var(--text-primary)',
                  fontWeight:'600',
                  marginBottom:'4px'
                }}>
                  📧 Email reminders
                </div>
                <div style={{fontSize:'13px', color:'var(--text-secondary)'}}>
                  Ontvang dagelijks een motiverende email
                </div>
              </div>
              <input 
                type="checkbox"
                checked={emailReminders}
                onChange={(e) => setEmailReminders(e.target.checked)}
                style={{
                  width:'20px',
                  height:'20px',
                  cursor:'pointer'
                }}
              />
            </label>
          </div>

          {/* Reminder Time */}
          {emailReminders && (
            <div style={{marginBottom:'24px'}}>
              <label style={{
                display:'block',
                color:'var(--text-primary)',
                fontWeight:'600',
                marginBottom:'8px'
              }}>
                ⏰ Reminder tijd
              </label>
              <input 
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                style={{
                  width:'150px',
                  padding:'12px',
                  border:'1px solid var(--border-color)',
                  borderRadius:'8px',
                  fontSize:'14px',
                  background:'var(--card-bg)',
                  color:'var(--text-primary)'
                }}
              />
              <p style={{fontSize:'12px', color:'var(--text-muted)', marginTop:'6px'}}>
                Dagelijkse tijd voor je reminder (je lokale tijdzone)
              </p>
            </div>
          )}

          {/* Save Button */}
          <button 
            onClick={savePreferences}
            disabled={saving}
            style={{
              width:'100%',
              padding:'14px',
              background: saving ? 'var(--text-muted)' : 'var(--green-primary)',
              color:'white',
              border:'none',
              borderRadius:'8px',
              fontWeight:'600',
              fontSize:'16px',
              cursor: saving ? 'default' : 'pointer',
              marginBottom:'12px',
              transition:'all 0.2s'
            }}
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>

          {/* Test Email Button */}
          <button 
            onClick={sendTestEmail}
            disabled={testingSend || !emailReminders || !email}
            style={{
              width:'100%',
              padding:'14px',
              background: testingSend || !emailReminders || !email ? '#e5e7eb' : '#f3f4f6',
              color: testingSend || !emailReminders || !email ? '#9ca3af' : '#374151',
              border:'1px solid var(--border-color)',
              borderRadius:'8px',
              fontWeight:'600',
              fontSize:'16px',
              cursor: testingSend || !emailReminders || !email ? 'default' : 'pointer',
              transition:'all 0.2s'
            }}
          >
            {testingSend ? '📤 Versturen...' : '🧪 Verstuur test email'}
          </button>

          {/* Message */}
          {message && (
            <div style={{
              marginTop:'16px',
              padding:'12px',
              background: message.includes('✓') ? '#d1fae5' : '#fee2e2',
              color: message.includes('✓') ? '#065f46' : '#991b1b',
              borderRadius:'8px',
              textAlign:'center',
              fontSize:'14px'
            }}>
              {message}
            </div>
          )}

          {/* Info Box */}
          <div style={{
            marginTop:'24px',
            padding:'16px',
            background:'#eff6ff',
            borderRadius:'8px',
            border:'1px solid #bfdbfe'
          }}>
            <p style={{
              fontSize:'13px',
              color:'#1e40af',
              margin:'0',
              lineHeight:'1.6'
            }}>
              <strong>💡 Let op:</strong> Voor echte email verzending heb je een Resend API key nodig. 
              Voeg <code style={{background:'white', padding:'2px 4px', borderRadius:'4px'}}>RESEND_API_KEY</code> toe aan je environment variables.
              <br/><br/>
              <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" style={{color:'#2563eb'}}>
                → Krijg gratis API key bij Resend
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
