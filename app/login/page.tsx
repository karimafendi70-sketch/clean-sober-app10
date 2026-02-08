"use client"
import React, {useState} from 'react'

export default function LoginPage(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState<string|null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleLogin(){
    if(!email || !password) {
      setMessage('Vul email en wachtwoord in')
      return
    }
    setMessage(isSignUp ? 'Account aangemaakt!' : 'Ingelogd!')
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'}}>
      <div style={{background:'white',borderRadius:'12px',padding:'40px',boxShadow:'0 10px 40px rgba(0,0,0,0.1)',maxWidth:'420px',width:'100%'}}>
        
        <h1 style={{textAlign:'center',color:'#064e3b',marginBottom:'8px'}}>Sober Tracker</h1>
        <p style={{textAlign:'center',color:'#6b7280',marginBottom:'32px'}}>Jouw reis naar gezondheid</p>

        <div style={{marginBottom:'20px'}}>
          <label style={{display:'block',color:'#374151',fontWeight:'600',marginBottom:'6px'}}>E-mailadres</label>
          <input 
            type="email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder="jouw@email.com"
            style={{width:'100%',padding:'12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',transition:'all 0.2s'}}
            onFocus={e => e.target.style.borderColor='#16a34a'}
            onBlur={e => e.target.style.borderColor='#d1d5db'}
          />
        </div>

        <div style={{marginBottom:'24px'}}>
          <label style={{display:'block',color:'#374151',fontWeight:'600',marginBottom:'6px'}}>Wachtwoord</label>
          <input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            placeholder="••••••••"
            style={{width:'100%',padding:'12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',transition:'all 0.2s'}}
            onFocus={e => e.target.style.borderColor='#16a34a'}
            onBlur={e => e.target.style.borderColor='#d1d5db'}
          />
        </div>

        <button 
          onClick={handleLogin}
          style={{width:'100%',padding:'12px',background:'#16a34a',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'16px',cursor:'pointer',marginBottom:'12px',transition:'all 0.2s'}}
          onMouseEnter={e => {e.target.style.background='#15803d'; e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 4px 12px rgba(22,163,74,0.3)'}}
          onMouseLeave={e => {e.target.style.background='#16a34a'; e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none'}}
        >
          {isSignUp ? 'Account maken' : 'Inloggen'}
        </button>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          style={{width:'100%',padding:'12px',background:'#e5e7eb',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'16px',cursor:'pointer',transition:'all 0.2s'}}
          onMouseEnter={e => {e.target.style.background='#d1d5db'; e.target.style.transform='translateY(-2px)'}}
          onMouseLeave={e => {e.target.style.background='#e5e7eb'; e.target.style.transform='translateY(0)'}}
        >
          {isSignUp ? 'Al een account? Inloggen' : 'Geen account? Maak er een'}
        </button>

        {message && (
          <div style={{marginTop:'16px',padding:'12px',background:message.includes('!')? '#d1fae5':'#fee2e2',color:message.includes('!')? '#065f46':'#991b1b',borderRadius:'8px',textAlign:'center',fontSize:'14px'}}>
            ✓ {message}
          </div>
        )}

        <p style={{textAlign:'center',color:'#9ca3af',fontSize:'12px',marginTop:'20px'}}>
          Supabase integratie wordt binnenkort toegevoegd
        </p>
      </div>
    </div>
  )
}
