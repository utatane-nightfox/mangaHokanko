"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // ★ これを呼ぶ「唯一の場所」
      await supabase.auth.getSession();

      router.replace("/");
    };

    run();
  }, [router]);

  return <p className="p-6">ログイン処理中...</p>;
}
