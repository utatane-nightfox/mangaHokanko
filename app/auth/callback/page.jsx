"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("exchange error", error);
        router.replace("/login");
        return;
      }

      // ★ セッションが確実に入るのを待つ
      await new Promise((r) => setTimeout(r, 300));

      router.replace("/");
    };

    run();
  }, [router]);

  return <p className="p-10">ログイン処理中...</p>;
}
