import { createClient } from '@supabase/supabase-js'

// Usando tus credenciales directamente (solo para desarrollo)
const supabaseUrl = 'https://nskoxxyosucikvortvlv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5za294eHlvc3VjaWt2b3J0dmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTA3OTcsImV4cCI6MjA3OTA2Njc5N30.vL_2ldAerncF250oAmGHB_UOwUJ9N5sn9FiwnbosKu8'

// Verificar que las credenciales estén presentes
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials')
}

console.log('Conectando a Supabase:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})