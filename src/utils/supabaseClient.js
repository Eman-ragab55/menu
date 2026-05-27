import { createClient } from '@supabase/supabase-js'

// دالة تجلب القيم الحقيقية لايف أو ترجع الـ placeholder وقت الـ Build فقط
const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // إذا كنا جوه المتصفح (Client-side) أو المتغيرات الحقيقية موجودة، استخدميها فوراً
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return { url, key }
  }

  // قيم وهمية فقط عشان الـ Build Worker يعدي بسلام وميضربش
  return {
    url: 'https://placeholder-project.supabase.co',
    key: 'placeholder-anon-key'
  }
}

const config = getSupabaseConfig()

export const supabase = createClient(config.url, config.key)