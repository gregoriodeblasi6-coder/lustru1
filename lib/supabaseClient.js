import { createClient } from '@supabase/supabase-js'

// Legge le due chiavi dal file .env.local (le imposti tu, vedi sotto)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)