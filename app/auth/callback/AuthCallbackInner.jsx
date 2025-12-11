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
      if (!code) return router.push("/login");

      const supabase = supabaseBrowser();

      // 🔥 正しい書き方（オブジェクトとして渡す）
      const { data, error } = await supabase.auth.exchangeCodeForSession({ code });

      if (error) {
        console.error("Auth error:", error);
        return router.push("/login");
      }

      router.refresh(); // セッション更新
      router.push("/");
    };

    run();
  }, [params, router]);

  return <p>認証中...</p>;
}
