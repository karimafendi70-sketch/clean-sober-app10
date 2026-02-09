'use client'
import { AuthProvider } from '@/lib/AuthContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'
import React, { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        {mounted && <ThemeToggle />}
      </AuthProvider>
    </ThemeProvider>
  )
}
