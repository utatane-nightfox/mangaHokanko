"use client";

export const dynamic = "force-dynamic"; // ← 必須：SSR/SSGを無効化
export const runtime = "edge";          // ← Vercel でURL token処理が安定
export const revalidate = 0;            // ← 静的化を完全拒否

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      // URL の token fragment(#access_token=...) を Supabase が処理
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
        router.push("/login");
        return;
      }

      const session = data.session;

      if (session) {
        router.push("/"); 
      } else {
        router.push("/login");
      }
    };

    handleSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>認証中です…</p>
    </div>
  );
}
