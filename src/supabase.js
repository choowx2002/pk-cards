
import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://vvetxvmikhnnkdprpwzd.supabase.co'
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZXR4dm1pa2hubmtkcHJwd3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTM3MjQsImV4cCI6MjA1Njk4OTcyNH0.I0hrpL1RSNcAYTkt-GIjMHlW5gxLnWfGs0tkDCaBnY4"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
