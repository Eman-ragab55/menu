import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// حماية مطلقة للـ Build Worker: لو القيم مش جاهزة أو مش صالحة وقت الـ Build، بنباصي روابط وهمية سليمة الشكل
const isUrlValid = supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))

export const supabase = createClient(
  isUrlValid ? supabaseUrl : 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)