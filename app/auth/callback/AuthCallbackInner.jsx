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
        return router.push("/login");
      }

      // ★ v2 正しい書き方（オブジェクトで渡す）
      const { error } = await supabaseBrowser.auth.exchangeCodeForSession({
        code,
      });

      if (error) {
        console.error("auth callback error:", error);
        return router.push("/login");
      }

      // ★ 認証成功
      router.push("/");
    };

    run();
  }, [params, router]);

  return <p>認証中...</p>;
}
