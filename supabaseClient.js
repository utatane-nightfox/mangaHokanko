// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // ✅ iOSでもセッション保持
    autoRefreshToken: true,     // ✅ トークン自動更新
    detectSessionInUrl: true,   // ✅ URL内のセッション検出
  },
});
