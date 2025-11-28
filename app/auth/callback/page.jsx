"use client";

export const dynamic = "force-dynamic"; // ← これ必須！SSRされなくなる
export const revalidate = 0;

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ← これでエラー出なくなる

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        router.replace("/login");
        return;
      }

      if (data.session) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    };

    handleSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>認証中です…</p>
    </div>
  );
}
