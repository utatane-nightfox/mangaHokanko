"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function FavoritesPage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);

  useEffect(() => {
    supabase
      .from("manga_logs")
      .select("*")
      .eq("favorite", true)
      .then(({ data }) => setList(data || []));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">お気に入り</h1>
      {list.map(m => (
        <div key={m.id} className="bg-white p-3 mb-2 rounded shadow">
          {m.title}（{m.chapters}話）
        </div>
      ))}
    </main>
  );
}
