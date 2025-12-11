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

      const supabase = supabaseBrowser();  // ← ★ ここが必須！

      // セッション交換
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth error:", error);
        return router.push("/login");
      }

      // Next.js の SSR セッション更新
      router.refresh();

      // ホームへ
      router.push("/");
    };

    run();
  }, [params, router]);

  return <p>認証中...</p>;
}
