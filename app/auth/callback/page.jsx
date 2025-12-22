"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const code = params.get("code");

      if (!code) {
        console.error("認証コードがありません");
        router.replace("/login");
        return;
      }

      const supabase = supabaseBrowser();

      const { data, error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("セッション確定失敗:", error);
        router.replace("/login");
        return;
      }

      // ✅ ここで session が確定する
      router.replace("/");
    };

    run();
  }, [params, router]);

  return <div className="p-6">ログイン処理中…</div>;
}
