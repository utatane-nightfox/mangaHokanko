"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import MangaTable from "@/components/MangaTable";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(p);

      const { data: m } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setMangas(m || []);
    };
    load();
  }, []);

  if (!profile) return null;

  return (
    <main className="p-10 space-y-8">
      {/* 総数表示 */}
      <div className="flex gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          総話数<br />
          <b className="text-2xl">{profile.total_chapters}</b>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          登録作品数<br />
          <b className="text-2xl">{profile.total_registered}</b>
        </div>
      </div>

      {/* 一覧 */}
      <MangaTable mangas={mangas} />
    </main>
  );
}
