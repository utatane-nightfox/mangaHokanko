"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function FavoritesPage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // ログインユーザー取得
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // ★ 正しいテーブル & 条件
      const { data, error } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", user.id)
        .eq("favorite", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("favorites load error:", error);
      } else {
        setList(data || []);
      }

      setLoading(false);
    };

    load();
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">⭐ お気に入り</h1>

      {loading && <p>読み込み中...</p>}

      {!loading && list.length === 0 && (
        <p className="text-gray-500">お気に入りはまだありません</p>
      )}

      <div className="grid gap-3">
        {list.map((m) => (
          <div
            key={m.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{m.title}</div>
              <div className="text-sm text-gray-500">
                {m.chapters} 話
              </div>
            </div>
            <div className="text-yellow-500 text-xl">★</div>
          </div>
        ))}
      </div>
    </main>
  );
}
