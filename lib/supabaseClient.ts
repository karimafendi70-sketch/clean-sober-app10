'use client'

import { createClient } from '@supabase/supabase-js'

let supabase: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      // Return a dummy client that won't crash
      supabase = createClient('https://placeholder.supabase.co', 'placeholder-key')
    }
  }
  return supabase
}
