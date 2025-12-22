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
        router.replace("/login");
        return;
      }

      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth error:", error);
        router.replace("/login");
        return;
      }

      // ✅ セッション確定後にトップへ
      router.replace("/");
    };

    run();
  }, [params, router]);

  return <div className="p-6">認証中…</div>;
}
