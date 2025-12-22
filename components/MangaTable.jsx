"use client";

import { supabaseBrowser } from "@/utils/supabase/client";

export default function MangaTable({ mangas, reload }) {
  const supabase = supabaseBrowser();

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
        {mangas.map((m) => (
          <tr key={m.id} className="text-center">
            <td>{m.title}</td>
            <td>{m.chapters}</td>
            <td
              onClick={() => toggleFav(m)}
              className="cursor-pointer"
            >
              {m.favorite ? "★" : "☆"}
            </td>
            <td>
              <button onClick={() => remove(m.id)}>🗑</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
