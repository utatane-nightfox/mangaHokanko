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
        console.error("認証コードなし");
        router.push("/login");
        return;
      }

      const supabase = supabaseBrowser();

      const { error } = await supabase.auth.exchangeCodeForSession(code);

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
