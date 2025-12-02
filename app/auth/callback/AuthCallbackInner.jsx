"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const handleSession = async () => {
      const code = params.get("code");
      if (!code) {
        router.push("/login");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error(error);
        router.push("/login");
        return;
      }

      router.push("/");
    };

    handleSession();
  }, [params, router]);

  return <p>認証中...</p>;
}
