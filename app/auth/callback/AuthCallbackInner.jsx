"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const code = params.get("code");
      if (!code) {
        router.push("/login");
        return;
      }

      const supabase = supabaseBrowser();

      // ★★ ここが絶対に間違えてはいけない部分！ ★★
      const { data, error } = await supabase.auth.exchangeCodeForSession({
        code,
      });

      if (error) {
        console.error("Auth error:", error);
        router.push("/login");
        return;
      }

      router.refresh();
      router.push("/");
    };

    run();
  }, [params, router]);

  return <p>認証中...</p>;
}

const { data: sessionData } = await supabase.auth.getSession();
console.log("SESSION AFTER EXCHANGE:", sessionData);
