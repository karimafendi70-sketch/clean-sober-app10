'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { getSupabase } from './supabaseClient'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Check if Supabase is properly configured
function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) return false
  if (url.includes('your-project-url') || url.includes('placeholder')) return false
  if (key.includes('your-anon-key') || key.includes('placeholder')) return false
  if (!url.startsWith('http')) return false
  if (key.length < 20) return false
  
  return true
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for mock user first
    const mockUser = localStorage.getItem('mock-user')
    if (mockUser) {
      try {
        setUser(JSON.parse(mockUser))
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('mock-user')
      }
    }
    
    // Try Supabase only if properly configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock auth')
      setLoading(false)
      return
    }
    
    try {
      const supabase = getSupabase()
      
      // Check active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }).catch(err => {
        console.error('Auth session error, using mock:', err)
        setLoading(false)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('AuthProvider error, using mock:', error)
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    // Use mock auth if Supabase not configured
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('mock-users') || '[]'
      const users = JSON.parse(stored)
      const found = users.find((u: any) => u.email === email && u.password === password)
      if (!found) throw new Error('Ongeldige inloggegevens')
      const mockUser: any = { email, id: found.id }
      setUser(mockUser)
      localStorage.setItem('mock-user', JSON.stringify(mockUser))
      return
    }
    
    // Try Supabase
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('mock-user', JSON.stringify({ email, id: data.user.id }))
      }
    } catch (error: any) {
      // Fallback to localStorage mock auth on error
      const stored = localStorage.getItem('mock-users') || '[]'
      const users = JSON.parse(stored)
      const found = users.find((u: any) => u.email === email && u.password === password)
      if (!found) throw new Error('Ongeldige inloggegevens')
      const mockUser: any = { email, id: found.id }
      setUser(mockUser)
      localStorage.setItem('mock-user', JSON.stringify(mockUser))
    }
  }

  const signUp = async (email: string, password: string) => {
    // Use mock auth if Supabase not configured
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('mock-users') || '[]'
      const users = JSON.parse(stored)
      if (users.find((u: any) => u.email === email)) {
        throw new Error('Email bestaat al')
      }
      const newUser = { email, password, id: `mock-${Date.now()}` }
      users.push(newUser)
      localStorage.setItem('mock-users', JSON.stringify(users))
      const mockUser: any = { email, id: newUser.id }
      setUser(mockUser)
      localStorage.setItem('mock-user', JSON.stringify(mockUser))
      return
    }
    
    // Try Supabase
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('mock-user', JSON.stringify({ email, id: data.user.id }))
      }
    } catch (error: any) {
      // Fallback to localStorage mock auth on error
      const stored = localStorage.getItem('mock-users') || '[]'
      const users = JSON.parse(stored)
      if (users.find((u: any) => u.email === email)) {
        throw new Error('Email bestaat al')
      }
      const newUser = { email, password, id: `mock-${Date.now()}` }
      users.push(newUser)
      localStorage.setItem('mock-users', JSON.stringify(users))
      const mockUser: any = { email, id: newUser.id }
      setUser(mockUser)
      localStorage.setItem('mock-user', JSON.stringify(mockUser))
    }
  }

  const signOut = async () => {
    try {
      const supabase = getSupabase()
      await supabase.auth.signOut()
    } catch (error) {
      console.log('Supabase signout failed, using mock')
    }
    setUser(null)
    localStorage.removeItem('mock-user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
