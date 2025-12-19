"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("created_at");

  const load = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("mangahokanko")
      .select("*")
      .eq("user_id", session.user.id)
      .ilike("title", `%${query}%`)
      .order(sort, { ascending: sort === "title" });

    setList(data ?? []);
  };

  useEffect(() => { load(); }, [query, sort]);

  const toggleFav = async (id, v) => {
    await supabase.from("mangahokanko")
      .update({ favorite: !v })
      .eq("id", id);
    load();
  };

  const del = async (id) => {
    if (!confirm("削除しますか？")) return;
    await supabase.from("mangahokanko").delete().eq("id", id);
    load();
  };

  return (
    <div className="p-6">
      <input
        className="border p-2 w-full mb-4"
        placeholder="検索"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <div className="flex justify-end gap-2 mb-2">
        <button onClick={() => setSort("created_at")}>登録順</button>
        <button onClick={() => setSort("title")}>名前順</button>
      </div>

      <table className="w-full bg-white border">
        <thead>
          <tr>
            <th>タイトル</th>
            <th>話数</th>
            <th>★</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {list.map(m => (
            <tr key={m.id} className="border-t">
              <td>{m.title}</td>
              <td>{m.episode}</td>
              <td onClick={() => toggleFav(m.id, m.favorite)}>
                {m.favorite ? "★" : "☆"}
              </td>
              <td>
                <button onClick={() => del(m.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
