"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // SupabaseがURLのトークンを検出してログイン状態を復元
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        router.push("/login");
        return;
      }

      const session = data.session;
      if (session) {
        router.push("/"); // 認証後、トップへ
      } else {
        router.push("/login"); // 失敗時
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
