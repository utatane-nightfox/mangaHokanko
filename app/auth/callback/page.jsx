"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/supabaseClient";

export const dynamic = "force-dynamic";

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const handleLogin = async () => {
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
      if (error) {
        console.error("Auth callback error:", error);
        router.replace("/login");
        return;
      }
      router.replace("/");
    };

    handleLogin();
  }, [router, params]);

  return <p>認証中 ...</p>;
}
