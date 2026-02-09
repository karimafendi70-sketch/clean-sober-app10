'use client'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/lib/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--card-bg)',
        border: '2px solid var(--border-color)',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}
      onMouseEnter={e => {
        const el = e.target as HTMLButtonElement
        el.style.transform = 'scale(1.1)'
        el.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'
      }}
      onMouseLeave={e => {
        const el = e.target as HTMLButtonElement
        el.style.transform = 'scale(1)'
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
