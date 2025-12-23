"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function MangaTable({ mangas, reload }) {
  const supabase = supabaseBrowser();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("created_at");

  const filtered = mangas
    .filter(m =>
      m.title.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title, "ja");
      return new Date(a.created_at) - new Date(b.created_at);
    });

  const toggleFav = async (m) => {
    await supabase
      .from("mangas")
      .update({ favorite: !m.favorite })
      .eq("id", m.id);
    reload();
  };

  const remove = async (id) => {
    await supabase.from("mangas").delete().eq("id", id);
    reload();
  };

  return (
    <>
      {/* 検索＆ソート */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="🔎 検索"
          className="flex-1 px-4 py-2 rounded border"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded border"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="created_at">登録日順</option>
          <option value="title">あいうえお順</option>
        </select>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-teal-100">
          <tr>
            <th>タイトル</th>
            <th>話数</th>
            <th>★</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m.id} className="text-center">
              <td>{m.title}</td>
              <td>{m.chapters}</td>
              <td onClick={() => toggleFav(m)} className="cursor-pointer">
                {m.favorite ? "★" : "☆"}
              </td>
              <td>
                <button onClick={() => remove(m.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
