"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function FavoritesPage() {
  const supabase = supabaseBrowser();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data, error } = await supabase
        .from("mangahokanko")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("favorite", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setFavorites([]);
      } else {
        setFavorites(data ?? []);
      }

      setLoading(false);
    };

    load();
  }, [supabase]);

  if (loading) return <p>読み込み中…</p>;

  return (
    <div>
      <h2>お気に入り</h2>
      {favorites.length === 0 ? (
        <p>まだありません</p>
      ) : (
        favorites.map((f) => (
          <div key={f.id}>
            {f.title}（{f.episode}話）
          </div>
        ))
      )}
    </div>
  );
}
