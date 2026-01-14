"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // ★ これだけでOK（セッション確定用）
      await supabase.auth.getSession();

      // ★ 必ずトップへ
      router.replace("/");
    };

    run();
  }, [router]);

  return null;
}
