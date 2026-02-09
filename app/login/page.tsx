"use client"
import React, {useState} from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState<string|null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  async function handleAuth(){
    if(!email || !password) {
      setMessage('Vul email en wachtwoord in')
      return
    }
    
    setLoading(true)
    setMessage(null)
    
    try {
      if(isSignUp) {
        await signUp(email, password)
        setMessage('✓ Account aangemaakt! Check je email voor verificatie.')
      } else {
        await signIn(email, password)
        setMessage('✓ Ingelogd!')
        setTimeout(() => router.push('/'), 1000)
      }
    } catch (error: any) {
      setMessage('✗ ' + (error.message || 'Er ging iets mis'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)'}}>
      <div style={{background:'var(--card-bg)',borderRadius:'12px',padding:'40px',boxShadow:'0 10px 40px rgba(0,0,0,0.1)',maxWidth:'420px',width:'100%'}}>
        
        <h1 style={{textAlign:'center',color:'var(--text-primary)',marginBottom:'8px'}}>Sober Tracker</h1>
        <p style={{textAlign:'center',color:'var(--text-secondary)',marginBottom:'32px'}}>Jouw reis naar gezondheid</p>

        <div style={{marginBottom:'20px'}}>
          <label style={{display:'block',color:'var(--text-primary)',fontWeight:'600',marginBottom:'6px'}}>E-mailadres</label>
          <input 
            type="email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder="jouw@email.com"
            style={{width:'100%',padding:'12px',border:'1px solid var(--border-color)',borderRadius:'8px',fontSize:'14px',transition:'all 0.2s',background:'var(--card-bg)',color:'var(--text-primary)'}}
            onFocus={e => {const el = e.target as HTMLInputElement; el.style.borderColor='var(--green-primary)'}}
            onBlur={e => {const el = e.target as HTMLInputElement; el.style.borderColor='var(--border-color)'}}
          />
        </div>

        <div style={{marginBottom:'24px'}}>
          <label style={{display:'block',color:'var(--text-primary)',fontWeight:'600',marginBottom:'6px'}}>Wachtwoord</label>
          <input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            placeholder="••••••••"
            style={{width:'100%',padding:'12px',border:'1px solid var(--border-color)',borderRadius:'8px',fontSize:'14px',transition:'all 0.2s',background:'var(--card-bg)',color:'var(--text-primary)'}}
            onFocus={e => {const el = e.target as HTMLInputElement; el.style.borderColor='var(--green-primary)'}}
            onBlur={e => {const el = e.target as HTMLInputElement; el.style.borderColor='var(--border-color)'}}
          />
        </div>

        <button 
          onClick={handleAuth}
          disabled={loading}
          style={{width:'100%',padding:'12px',background:loading?'var(--text-muted)':'var(--green-primary)',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'16px',cursor:loading?'default':'pointer',marginBottom:'12px',transition:'all 0.2s'}}
          onMouseEnter={e => {if(!loading){const el = e.target as HTMLButtonElement; el.style.background='var(--green-dark)'; el.style.transform='translateY(-2px)'; el.style.boxShadow='0 4px 12px rgba(22,163,74,0.3)'}}}  
          onMouseLeave={e => {if(!loading){const el = e.target as HTMLButtonElement; el.style.background='var(--green-primary)'; el.style.transform='translateY(0)'; el.style.boxShadow='none'}}}
        >
          {loading ? 'Bezig...' : (isSignUp ? 'Account maken' : 'Inloggen')}
        </button>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          style={{width:'100%',padding:'12px',background:'#e5e7eb',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'16px',cursor:'pointer',transition:'all 0.2s'}}
          onMouseEnter={e => {const el = e.target as HTMLButtonElement; el.style.background='#d1d5db'; el.style.transform='translateY(-2px)'}}
          onMouseLeave={e => {const el = e.target as HTMLButtonElement; el.style.background='#e5e7eb'; el.style.transform='translateY(0)'}}
        >
          {isSignUp ? 'Al een account? Inloggen' : 'Geen account? Maak er een'}
        </button>

        {message && (
          <div style={{marginTop:'16px',padding:'12px',background:message.includes('✓')? '#d1fae5':'#fee2e2',color:message.includes('✓')? '#065f46':'#991b1b',borderRadius:'8px',textAlign:'center',fontSize:'14px'}}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
