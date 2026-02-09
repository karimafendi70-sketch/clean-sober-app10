import { NextResponse } from 'next/server'

// This endpoint will be called daily by Vercel Cron
// Schedule: "0 9 * * *" = Every day at 9:00 AM UTC
export async function GET(request: Request) {
  try {
    // Verify this is a Cron request
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if email service is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping email reminders')
      return NextResponse.json({ 
        success: false, 
        message: 'Email service not configured' 
      })
    }

    // In a real implementation, this would:
    // 1. Query database for all users with active streaks
    // 2. Check their notification preferences
    // 3. Send emails to users who want reminders at this time
    
    // For now with localStorage, we'll return a success message
    // Users can manually test via the settings page
    
    console.log('Daily reminder cron job executed')
    
    return NextResponse.json({ 
      success: true,
      message: 'Cron job executed',
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}
