"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import MangaTable from "@/components/MangaTable";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const [mangas, setMangas] = useState([]);

  const load = async () => {
    const { data } = await supabase.from("mangas").select("*").order("created_at");
    setMangas(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const totalChapters = mangas.reduce((a, b) => a + b.chapters, 0);

  return (
    <main className="p-6">
      <div className="mb-4 bg-white p-4 rounded shadow">
        <p>📚 合計話数：{totalChapters}</p>
        <p>📖 登録作品数：{mangas.length}</p>
      </div>

      <MangaTable mangas={mangas} reload={load} />
    </main>
  );
}
