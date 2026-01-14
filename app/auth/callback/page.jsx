"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // ★ これが超重要
      await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      // ★ code を完全に消した状態でトップへ
      router.replace("/");
    };

    run();
  }, [router]);

  return <p className="p-10">ログイン処理中...</p>;
}
