import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API key not configured')
      return NextResponse.json({ 
        success: false, 
        message: 'Email service not configured' 
      }, { status: 503 })
    }

    // Initialize Resend only when we need it
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const { email, days, milestones } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Determine milestone emoji
    let emoji = '🌟'
    let milestone = ''
    
    if (days >= 365) {
      emoji = '🏆'
      milestone = 'Een heel jaar!'
    } else if (days >= 180) {
      emoji = '🥈'
      milestone = 'Een half jaar!'
    } else if (days >= 90) {
      emoji = '🥉'
      milestone = '90 dagen!'
    } else if (days >= 30) {
      emoji = '⭐'
      milestone = '30 dagen!'
    } else if (days >= 7) {
      emoji = '🌱'
      milestone = 'Een week!'
    }

    const subject = milestone 
      ? `${emoji} ${milestone} - Je bent ${days} dagen schoon!`
      : `${emoji} Dag ${days} - Goed bezig!`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sober Tracker Reminder</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0fdf4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; font-size: 48px; margin: 0;">${emoji}</h1>
              <h2 style="color: #15803d; margin: 10px 0;">${milestone || 'Goed bezig!'}</h2>
              <p style="font-size: 28px; font-weight: 700; color: #16a34a; margin: 10px 0;">${days} dag${days === 1 ? '' : 'en'}</p>
              <p style="font-size: 18px; color: #6b7280;">schoon en sterk 💪</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; padding: 24px; margin: 20px 0;">
              <p style="margin: 0; color: #166534; font-size: 16px; line-height: 1.6;">
                👏 <strong>Trots op je!</strong><br>
                Elke dag is een overwinning. Blijf focussen op je doelen en vergeet niet hoe ver je al bent gekomen.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://clean-sober-app10.vercel.app/dashboard" 
                 style="display: inline-block; background: #16a34a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Bekijk je dashboard →
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px; margin: 5px 0;">
                Deze email komt van je Sober Tracker app
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                Wil je geen dagelijkse reminders meer? 
                <a href="https://clean-sober-app10.vercel.app/settings" style="color: #16a34a;">Pas je instellingen aan</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: 'Sober Tracker <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: htmlContent,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      messageId: data?.id 
    })

  } catch (error: any) {
    console.error('Send reminder error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to send email' 
    }, { status: 500 })
  }
}
