"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

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

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("exchangeCodeForSession error:", error);
        router.push("/login");
        return;
      }

      router.push("/");
    };

    run();
  }, [params, router]);

  return <p>認証中...</p>;
}
