import './globals.css'
import { Providers } from './providers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sober Tracker',
  description: 'A tiny sober tracker'
}

export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <main style={{maxWidth:800,margin:'2rem auto',padding:'0 1rem'}}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
