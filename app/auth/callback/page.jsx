"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // ★ ここでセッションを「確定」させる
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        // ★ 確定したあとに遷移
        router.replace("/");
      } else {
        router.replace("/login");
      }
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      ログイン処理中…
    </div>
  );
}
