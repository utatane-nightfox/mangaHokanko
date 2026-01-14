"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../utils/supabase/client";
import MangaTable from "../components/MangaTable";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [mangas, setMangas] = useState([]);
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: list } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setProfile(p);
      setMangas(list || []);
      setLoading(false);
    };

    load();
  }, [router, supabase]);

  if (loading) return <div className="p-10">読み込み中...</div>;

  const filtered = mangas.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="pt-24 max-w-5xl mx-auto px-6 space-y-8">
      {/* ダッシュボード */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-emerald-100 rounded-2xl p-6 shadow">
          <p className="text-sm text-emerald-700">総話数</p>
          <p className="text-3xl font-bold">{profile?.total_chapters ?? 0}</p>
        </div>
        <div className="bg-sky-100 rounded-2xl p-6 shadow">
          <p className="text-sm text-sky-700">登録作品数</p>
          <p className="text-3xl font-bold">{profile?.total_registered ?? 0}</p>
        </div>
      </div>

      {/* 検索 */}
      <SearchBar value={search} onChange={setSearch} />

      {/* 一覧 */}
      <MangaTable mangas={filtered} reload={() => location.reload()} />
    </main>
  );
}
