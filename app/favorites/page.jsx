"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../utils/supabase/client";
import MangaTable from "../../components/MangaTable";
import MainLayout from "../../components/layouts/MainLayout";

export default function FavoritesPage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);

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
    };

    load();
  }, []);

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-6">
        <section className="bg-white rounded-xl shadow p-4">
          <MangaTable mangas={list} reload={() => location.reload()} />
        </section>
      </main>
    </MainLayout>
  );
}
