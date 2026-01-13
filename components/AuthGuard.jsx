"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createServerSupabase } from "../utils/supabase/client";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };
    check();
  }, [router]);

  if (loading) return <div className="p-6">読み込み中…</div>;

  return children;
}
