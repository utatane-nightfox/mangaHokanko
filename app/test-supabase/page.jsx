"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TestSupabasePage() {
  const [status, setStatus] = useState("確認中...");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Supabaseセッション確認
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data?.session) {
          setUser(data.session.user);
          setStatus("✅ Supabase 接続OK！ログイン済みです。");
        } else {
          setStatus("⚠️ Supabase 接続OK、ただしログインしていません。");
        }
      } catch (err) {
        console.error("接続エラー:", err);
        setStatus("❌ Supabase 接続失敗");
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase 接続テスト</h1>
      <p className="text-lg mb-2">{status}</p>
      {user && (
        <div className="mt-4 bg-white p-4 rounded shadow-md">
          <p>📧 メール: {user.email}</p>
          <p>🆔 ID: {user.id}</p>
        </div>
      )}
    </div>
  );
}
