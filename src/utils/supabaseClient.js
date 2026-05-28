import { createClient } from '@supabase/supabase-js'

// دالة تجلب القيم الحقيقية لايف أو ترجع الـ placeholder وقت الـ Build فقط
const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // إذا كنا جوه المتصفح (Client-side) أو المتغيرات الحقيقية مقروءة وموجودة بنجاح
  if (url && (url.trim().startsWith('http://') || url.trim().startsWith('https://'))) {
    return { 
      url: url.trim(), 
      key: key ? key.trim() : key 
    }
  }

  // قيم وهمية فقط عشان الـ Build Worker في Vercel يعدي بسلام وميضربش
  return {
    url: 'https://placeholder-project.supabase.co',
    key: 'placeholder-anon-key'
  }
}

const config = getSupabaseConfig()

export const supabase = createClient(config.url, config.key)