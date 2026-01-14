"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // ★ ここ「だけ」で getSession
      await supabase.auth.getSession();

      router.replace("/");
    };
    run();
  }, [router]);

  return <p>ログイン処理中...</p>;
}
