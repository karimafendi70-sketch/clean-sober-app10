#!/usr/bin/env node

const readline = require('readline')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🌟 Sober Tracker - Email Setup Wizard 🌟          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

Dit script helpt je stap-voor-stap bij het configureren van email notifications.

`)

async function setup() {
  try {
    // Check which services to setup
    console.log('Welke service(s) wil je configureren?\n')
    console.log('1. 📧 Resend (voor dagelijkse reminders)')
    console.log('2. 🔐 Supabase (voor auth + database + signup emails)')
    console.log('3. 🎯 Beide\n')
    
    const choice = await question('Kies (1/2/3): ')
    
    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''
    
    if (choice === '1' || choice === '3') {
      console.log('\n' + '='.repeat(55))
      console.log('📧 RESEND SETUP')
      console.log('='.repeat(55) + '\n')
      
      console.log('1. Open in je browser: https://resend.com/signup')
      console.log('2. Maak een gratis account')
      console.log('3. Ga naar: https://resend.com/api-keys')
      console.log('4. Klik "Create API Key"')
      console.log('5. Kopieer de key (begint met "re_")\n')
      
      const resendKey = await question('Plak je Resend API key hier: ')
      
      if (resendKey && resendKey.startsWith('re_')) {
        envContent = updateEnvVar(envContent, 'RESEND_API_KEY', resendKey)
        console.log('✅ Resend API key opgeslagen!\n')
      } else {
        console.log('⚠️  Ongeldige key - overgeslagen\n')
      }
      
      // Cron secret
      const cronSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      envContent = updateEnvVar(envContent, 'CRON_SECRET', cronSecret)
      console.log('✅ CRON_SECRET automatisch gegenereerd\n')
    }
    
    if (choice === '2' || choice === '3') {
      console.log('\n' + '='.repeat(55))
      console.log('🔐 SUPABASE SETUP')
      console.log('='.repeat(55) + '\n')
      
      console.log('1. Open in je browser: https://supabase.com')
      console.log('2. Klik "New Project"')
      console.log('3. Wacht 2 minuten tot project klaar is')
      console.log('4. Ga naar Settings → API')
      console.log('5. Kopieer de Project URL en anon public key\n')
      
      const supabaseUrl = await question('Plak Project URL (https://...supabase.co): ')
      const supabaseKey = await question('Plak anon public key (eyJ...): ')
      
      if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
        envContent = updateEnvVar(envContent, 'NEXT_PUBLIC_SUPABASE_URL', supabaseUrl)
        console.log('✅ Supabase URL opgeslagen!')
      }
      
      if (supabaseKey && supabaseKey.startsWith('eyJ')) {
        envContent = updateEnvVar(envContent, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseKey)
        console.log('✅ Supabase API key opgeslagen!\n')
        
        // Ask to run SQL schema
        console.log('📊 Database schema moet nog worden uitgevoerd.')
        console.log('   Kopieer de SQL uit: supabase/schema.sql')
        console.log('   Plak in Supabase dashboard → SQL Editor → Run\n')
        
        const openSchema = await question('Schema bestand openen? (y/n): ')
        if (openSchema.toLowerCase() === 'y') {
          const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
          if (fs.existsSync(schemaPath)) {
            console.log('\n' + fs.readFileSync(schemaPath, 'utf8'))
          }
        }
      }
    }
    
    // Write .env.local
    fs.writeFileSync(envPath, envContent)
    
    console.log('\n' + '='.repeat(55))
    console.log('✨ SETUP COMPLEET!')
    console.log('='.repeat(55) + '\n')
    
    console.log('📝 Volgende stappen:\n')
    console.log('1. Herstart dev server: npm run dev')
    console.log('2. Test emails op: http://localhost:3000/settings')
    console.log('3. Voor productie:')
    console.log('   vercel env add RESEND_API_KEY production')
    console.log('   vercel env add NEXT_PUBLIC_SUPABASE_URL production')
    console.log('   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production\n')
    
    rl.close()
    
  } catch (error) {
    console.error('Error:', error.message)
    rl.close()
    process.exit(1)
  }
}

function updateEnvVar(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm')
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`)
  } else {
    return content + `\n${key}=${value}`
  }
}

setup()
