// app/favorites/page.jsx
"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/utils/supabase/client";
import { FaStar, FaRegStar, FaTrash, FaEdit } from "react-icons/fa";


export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mangaHokanko")
      .select("*")
      .eq("favorite", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setFavorites([]);
    } else {
      setFavorites(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFavs();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg border">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">お気に入りリスト</h2>
        {loading ? (
          <p>読み込み中…</p>
        ) : favorites.length === 0 ? (
          <p className="text-gray-500">まだお気に入りがありません。</p>
        ) : (
          <ul className="space-y-3">
            {favorites.map((f) => (
              <li key={f.id} className="flex justify-between items-center border rounded-lg p-3">
                <div>
                  <div className="font-medium">{f.title}</div>
                  <div className="text-sm text-gray-500">{f.episode} 話</div>
                </div>
                <div className="text-yellow-400 text-2xl">★</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
