"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import MangaTable from "@/components/MangaTable";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", auth.user.id)
        .single();

      const { data: m } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: true });

      setProfile(p);
      setMangas(m || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return null;

  return (
    <main className="p-8 space-y-8">
      {/* 集計カード */}
      <div className="flex gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          総話数
          <div className="text-2xl font-bold">
            {profile.total_chapters}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          登録作品数
          <div className="text-2xl font-bold">
            {profile.total_registered}
          </div>
        </div>
      </div>

      {/* 一覧 */}
      <MangaTable
        list={mangas}
        showFavorite
      />
    </main>
  );
}
