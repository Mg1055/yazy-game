import { createClient } from '@supabase/supabase-js'

// For development, you'll need to replace these with your actual Supabase credentials
// Get them from https://supabase.com/dashboard/project/[project-id]/settings/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://wtgplwthozxhyjgqfxno.supabase.co"
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Z3Bsd3Rob3p4aHlqZ3FmeG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjMyODAsImV4cCI6MjA2OTAzOTI4MH0.DRwcRwEyURS-QoykI5g9twYx4B3FDkhGPEy2lEDBWg4"

export const supabase = createClient(supabaseUrl, supabaseKey) 
