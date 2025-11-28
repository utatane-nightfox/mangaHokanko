"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";

export const dynamic = "force-dynamic"; // ← これが超重要！！

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      // Supabase が URL のトークンを処理
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
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
