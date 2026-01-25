"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // ✅ v2 正解：引数なし
      const { data, error } =
        await supabase.auth.exchangeCodeForSession();

      if (error) {
        console.error("exchange error", error);
        router.replace("/login");
        return;
      }

      // ✅ セッション保存を確実に待つ
      await new Promise((r) => setTimeout(r, 500));

      router.replace("/");
    };

    run();
  }, [router]);

  return <p className="p-10">ログイン処理中...</p>;
}
