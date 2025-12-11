"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";
const supabase = supabaseBrowser();

export default function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const code = params.get("code");
      if (!code) return router.push("/login");

      // 🌟 セッション交換
      const { error } = await supabaseBrowser.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth error:", error);
        return router.push("/login");
      }

      // 🌟 SSR のセッションを更新させるために必要
      router.refresh();

      // ホームへ
      router.push("/");
    };

    run();
  }, [params, router]);

  return <p>認証中...</p>;
}
