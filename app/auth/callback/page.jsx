"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/supabaseClient";

export const dynamic = "force-dynamic"; // 🔥 これ必須：SSR を完全無効化

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams(); // 🔥 SuspenseなしでCSRにするために use client が必須

  useEffect(() => {
    const handleSession = async () => {
      // Supabase が URL のトークンを処理して session を復元する
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        router.push("/login");
        return;
      }

      if (data.session) {
        router.push("/");
      } else {
        router.push("/login");
      }
    };

    handleSession();
  }, [router, params]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>認証中です…</p>
    </div>
  );
}

