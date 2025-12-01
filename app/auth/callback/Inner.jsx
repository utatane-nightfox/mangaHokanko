"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/supabaseClient";

export default function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const handleSession = async () => {
      await supabase.auth.exchangeCodeForSession(params);

      const { data: { session } } = await supabase.auth.getSession();

      router.push(session ? "/" : "/login");
    };

    handleSession();
  }, [params, router]);

  return <p>認証中...</p>;
}
