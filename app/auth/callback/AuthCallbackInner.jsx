"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function AuthCallbackInner() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.getSession();
      if (error) {
        router.replace("/login");
        return;
      }
      router.replace("/");
    };
    run();
  }, [router]);

  return <div className="p-6 text-center">ログイン処理中…</div>;
}
