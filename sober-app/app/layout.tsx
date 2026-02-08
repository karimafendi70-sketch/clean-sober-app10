import './globals.css'

export const metadata = {
  title: 'Sober Tracker',
  description: 'A tiny sober tracker'
}

export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="en">
      <body>
        <main style={{maxWidth:800,margin:'2rem auto',padding:'0 1rem'}}>
          {children}
        </main>
      </body>
    </html>
  )
}
