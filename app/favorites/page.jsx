"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../utils/supabase/client";
import MangaTable from "../../components/MangaTable";
import MainLayout from "../../components/layouts/MainLayout";

export default function FavoritesPage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", user.id)
        .eq("favorite", true);

      setList(data || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="p-10">読み込み中…</div>;

  return (
    <MainLayout>
      <section className="bg-white rounded-xl shadow p-4">
        <h1 className="text-xl font-bold mb-4">お気に入り</h1>
        <MangaTable mangas={list} reload={() => location.reload()} />
      </section>
    </MainLayout>
  );
}
