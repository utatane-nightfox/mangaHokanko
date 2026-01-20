"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // ✅ まず現在のセッションを確認
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // すでにログイン済みなら何もしないでトップへ
      if (session) {
        router.replace("/");
        return;
      }

      // 🔽 まだセッションが無いときだけ code を交換
      await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      // 🔽 code を消した状態でトップへ
      router.replace("/");
    };

    run();
  }, [router]);

  return <p className="p-10">ログイン処理中...</p>;
}
