"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../utils/supabase/client";

export default function AuthCallbackInner() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      await supabase.auth.getSession();
      router.replace("/");
    };

    run();
  }, [router]);

  return <p>ログイン処理中...</p>;
}
