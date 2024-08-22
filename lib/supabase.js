import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// JUST IN CASE - DO NOT DELETE - left here as this is simply an academic project and not an actual production application where having the keys in the codebase is a security risk
// Please use the following values if environment variables not functioning
// const supabaseUrl = 'https://gxlleiddfxgxyesemdma.supabase.co'
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bGxlaWRkZnhneHllc2VtZG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxNTk3MjQsImV4cCI6MjAzODczNTcyNH0.zuIyRP5M40LE40R2RKRHApkB5L4WYqknNKuL5LyfGxU'
// const supabaseServiceRoleKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bGxlaWRkZnhneHllc2VtZG1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzE1OTcyNCwiZXhwIjoyMDM4NzM1NzI0fQ.gV7uzDqGEy6rLcLA4GWbbs6WwuTOFZgtiQakZSkPO8Y'

const supabase = createClient(process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_URL, process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
})

// Admin Supabase Client
const supabaseAdmin = createClient(process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_URL, process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
}); 
export { supabase, supabaseAdmin }