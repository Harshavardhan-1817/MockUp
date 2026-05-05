import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://ghmrevxqhyrfirtvyghq.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobXJldnhxaHlyZmlydHZ5Z2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDgzODIsImV4cCI6MjA5MDc4NDM4Mn0.iHeeAGO43lJW6M1IGrUHr27V1cgQg9OukUOVERZeVNQ"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)