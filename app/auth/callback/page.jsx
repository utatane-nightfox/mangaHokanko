"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // ✅ ここでセッションを確定させる（1回だけ）
      await supabase.auth.getSession();

      // ✅ code を消してトップへ
      router.replace("/");
    };

    run();
  }, [router]);

  return <p className="p-6">ログイン処理中...</p>;
}
