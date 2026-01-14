"use client";
import { supabaseBrowser } from "../utils/supabase/client";
import { ROW_COLORS } from "./rowColors";

export default function MangaTable({ mangas, reload }) {
  const supabase = supabaseBrowser();

  const toggleFav = async (m) => {
    await supabase
      .from("mangas")
      .update({ favorite: !m.favorite })
      .eq("id", m.id);
    reload();
  };

  const changeColor = async (m, c) => {
    await supabase
      .from("mangas")
      .update({ row_color: c })
      .eq("id", m.id);
    reload();
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {mangas.map((m) => (
        <div
          key={m.id}
          className={`flex items-center justify-between p-4 border-l-8 ${m.row_color}`}
        >
          <div>
            <div className="font-bold">{m.title}</div>
            <div className="text-sm text-gray-500">{m.author}</div>
          </div>

          <div className="flex items-center gap-3">
            {/* お気に入り */}
            <button onClick={() => toggleFav(m)} className="text-2xl">
              {m.favorite ? "★" : "☆"}
            </button>

            {/* 色 */}
            <select
              value={m.row_color}
              onChange={(e) => changeColor(m, e.target.value)}
              className="border rounded px-2"
            >
              {ROW_COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
