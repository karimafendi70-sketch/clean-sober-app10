'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sober-theme') as Theme
      if (stored && (stored === 'light' || stored === 'dark')) {
        setTheme(stored)
        document.documentElement.setAttribute('data-theme', stored)
      } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    } catch (e) {
      console.error('Theme init error:', e)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem('sober-theme', theme)
        document.documentElement.setAttribute('data-theme', theme)
      } catch (e) {
        console.error('Theme save error:', e)
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
