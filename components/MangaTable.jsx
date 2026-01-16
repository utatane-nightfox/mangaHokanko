"use client";

import { supabaseBrowser } from "../utils/supabase/client";
import { ROW_COLORS, ROW_COLOR_MAP } from "./rowColors";

export default function MangaTable({ mangas, reload }) {
  const supabase = supabaseBrowser();

  const toggleFav = async (m) => {
    await supabase
      .from("mangas")
      .update({ favorite: !m.favorite })
      .eq("id", m.id);
    reload();
  };

  const changeColor = async (m, colorKey) => {
    await supabase
      .from("mangas")
      .update({ row_color: colorKey })
      .eq("id", m.id);
    reload();
  };

  return (
    <div className="space-y-3">
      {mangas.map((m) => {
        const borderClass =
          ROW_COLOR_MAP[m.row_color] ?? "border-gray-300";

        return (
          <div
            key={m.id}
            className={`flex items-center justify-between p-4 bg-white rounded-xl shadow border-l-8 ${borderClass}`}
          >
            <div>
              <div className="font-bold text-lg">{m.title}</div>
              <div className="text-sm text-gray-500">
                {m.author ?? "作者未設定"}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* お気に入り */}
              <button
                onClick={() => toggleFav(m)}
                className="text-2xl hover:scale-110 transition"
              >
                {m.favorite ? "★" : "☆"}
              </button>

              {/* 行カラー */}
              <select
                value={m.row_color ?? "gray"}
                onChange={(e) => changeColor(m, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {ROW_COLORS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}
