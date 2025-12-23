"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import MangaTable from "@/components/MangaTable";

export default function FavoritesPage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);

  const load = async () => {
    const { data } = await supabase
      .from("mangas")
      .select("*")
      .eq("favorite", true)
      .order("created_at", { ascending: true });

    setList(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">お気に入り</h1>
      <MangaTable mangas={list} reload={load} />
    </main>
  );
}
