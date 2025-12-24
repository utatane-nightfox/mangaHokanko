"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import Header from "@/components/Header";
import MangaTable from "@/components/MangaTable";

export default function HomePage() {
  const supabase = supabaseBrowser();

  const [profile, setProfile] = useState(null);
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: m } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setProfile(p);
      setMangas(m || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-6">読み込み中…</div>;
  }

  if (!profile) {
    return <div className="p-6">ログインしてください</div>;
  }

  return (
    <>
      <Header />

      <main className="p-6 space-y-6">
        {/* ステータス */}
        <div className="flex gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            総話数<br />
            <b className="text-2xl">{profile.total_chapters}</b>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            登録数<br />
            <b className="text-2xl">{profile.total_registered}</b>
          </div>
        </div>

        {/* 一覧 */}
        <MangaTable mangas={mangas} reload={() => location.reload()} />
      </main>
    </>
  );
}
