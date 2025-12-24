"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login"); // ← ここ超重要
        return;
      }

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setProfile(p);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return null;

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">ホーム</h1>

      <div className="flex gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          総話数<br />
          <b className="text-2xl">{profile.total_chapters}</b>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          登録作品数<br />
          <b className="text-2xl">{profile.total_registered}</b>
        </div>
      </div>

      {/* 一覧表はここに今までのコードを戻す */}
    </main>
  );
}
