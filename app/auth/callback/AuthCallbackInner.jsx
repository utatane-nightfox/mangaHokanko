"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const code = params.get("code");
      if (!code) {
        console.error("認証コードなし");
        return router.push("/login");
      }

      const supabase = supabaseBrowser(); // Browserクライアント

      // --- セッション交換 ---
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth error:", error);
        return router.push("/login");
      }

      // セッションを最新化
      router.refresh();

      // ホームに遷移
      router.push("/");
    };

    run();
  }, [params, router]);

  return <p>認証中...</p>;
}
