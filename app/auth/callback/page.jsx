"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      // URL に含まれている code を取得（Supabaseが送ってくる）
      const code = searchParams.get("code");

      if (!code) {
        console.error("No auth code found");
        router.push("/login");
        return;
      }

      /// 🔥 ここが一番重要！ code をセッションに交換する
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth error:", error);
        router.push("/login");
        return;
      }

      // ログイン成功
      router.push("/");
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>認証中です…</p>
    </div>
  );
}
