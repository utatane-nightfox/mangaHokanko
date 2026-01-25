"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // URL に code がないなら即ログインへ
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (!code) {
        router.replace("/login");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("exchange error", error);
        router.replace("/login");
        return;
      }

      // ★ code を消してからトップへ
      router.replace("/");
    };

    run();
  }, [router]);

  return <p className="p-10">ログイン処理中...</p>;
}
