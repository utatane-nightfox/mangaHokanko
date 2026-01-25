"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // 🔴 交換処理はしない！
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // セッションが無ければログインへ
        router.replace("/login");
        return;
      }

      // 正常ログイン
      router.replace("/");
    };

    run();
  }, [router]);

  return <p className="p-10">ログイン処理中...</p>;
}
