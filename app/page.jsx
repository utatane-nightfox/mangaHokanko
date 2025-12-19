"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("manga_logs")
      .select("*")
      .order("created_at", { ascending: false });

    setList(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleFav = async (id, fav) => {
    await supabase.from("manga_logs").update({ favorite: !fav }).eq("id", id);
    load();
  };

  const remove = async (id) => {
    await supabase.from("manga_logs").delete().eq("id", id);
    load();
  };

  const filtered = list.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalChapters = list.reduce((a, b) => a + b.chapters, 0);

  return (
    <main className="p-6">
      <input
        className="border p-2 w-full mb-4"
        placeholder="検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mb-2 text-sm">
        合計話数：{totalChapters} / 登録数：{list.length}
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-sky-100">
          <tr>
            <th>タイトル</th>
            <th>話数</th>
            <th>お気に入り</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m.id} className="text-center border-t">
              <td>{m.title}</td>
              <td>{m.chapters}</td>
              <td>
                <button onClick={() => toggleFav(m.id, m.favorite)}>
                  {m.favorite ? "★" : "☆"}
                </button>
              </td>
              <td>
                <button onClick={() => remove(m.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
