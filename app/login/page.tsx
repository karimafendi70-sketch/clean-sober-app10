"use client"
import React, {useState} from 'react'
import { createClient } from '@supabase/supabase-js'

export default function LoginPage(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState<string|null>(null)
  const [loading,setLoading] = useState(false)

  async function signUp(){
    setLoading(true)
    setMessage(null)
    try{
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      const { data, error } = await supabase.auth.signUp({ email, password })
      if(error) setMessage(error.message)
      else setMessage('Check je inbox voor een bevestigingsmail (of ingelogd).')
    }catch(e:any){ setMessage(e.message) }
    setLoading(false)
  }

  async function signIn(){
    setLoading(true)
    setMessage(null)
    try{
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if(error) setMessage(error.message)
      else setMessage('Ingelogd')
    }catch(e:any){ setMessage(e.message) }
    setLoading(false)
  }

  return (
    <div className="container" style={{maxWidth:480}}>
      <h1>Login</h1>
      <div className="card">
        <label style={{display:'block',marginBottom:8}}>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,marginTop:4}} />
        </label>

        <label style={{display:'block',marginBottom:8}}>Wachtwoord
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,marginTop:4}} />
        </label>

        <div style={{display:'flex',gap:8}}>
          <button onClick={signIn} disabled={loading} style={{background:'#16a34a',color:'#fff',padding:'8px 12px',borderRadius:6,border:'none'}}>Inloggen</button>
          <button onClick={signUp} disabled={loading} style={{background:'#0ea5a4',color:'#fff',padding:'8px 12px',borderRadius:6,border:'none'}}>Registreren</button>
        </div>

        {message && <p style={{marginTop:12}}>{message}</p>}

      </div>
    </div>
  )
}
}
