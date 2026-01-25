"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // 🔴 URL から code を安全に取得
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      // 🔴 code が無いなら何もしない（超重要）
      if (!code) {
        router.replace("/login");
        return;
      }

      // 🔴 code がある時だけ exchange
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("exchange error", error);
        router.replace("/login");
        return;
      }

      // セッション安定待ち
      await new Promise((r) => setTimeout(r, 300));

      router.replace("/");
    };

    run();
  }, [router]);

  return <p className="p-10">ログイン処理中...</p>;
}
