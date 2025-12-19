"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function FavoritesPage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);

  useEffect(() => {
    supabase
      .from("mangas")
      .select("*")
      .eq("favorite", true)
      .then(({ data }) => setList(data || []));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl mb-4">★ お気に入り</h1>
      <ul className="bg-white rounded shadow p-4">
        {list.map((m) => (
          <li key={m.id}>{m.title}（{m.chapters}話）</li>
        ))}
      </ul>
    </main>
  );
}
