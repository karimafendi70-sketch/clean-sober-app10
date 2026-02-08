"use client"
import React, {useState} from 'react'

export default function LoginPage(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState<string|null>(null)

  async function handleLogin(){
    setMessage('Login functionality will be added with Supabase')
  }

  return (
    <div className="container" style={{maxWidth:480}}>
      <h1>Inloggen — Test</h1>
      <div className="card">
        <label style={{display:'block',marginBottom:8}}>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,marginTop:4}} />
        </label>

        <label style={{display:'block',marginBottom:8}}>Wachtwoord
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,marginTop:4}} />
        </label>

        <button onClick={handleLogin} style={{background:'#16a34a',color:'#fff',padding:'8px 12px',borderRadius:6,border:'none'}}>Inloggen</button>

        {message && <p style={{marginTop:12}}>{message}</p>}
      </div>
    </div>
  )
}
