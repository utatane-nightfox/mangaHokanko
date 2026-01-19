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
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const load = async () => {
      // 🔴 ここが最重要
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 未ログインならログイン画面へ
      if (!user) {
        router.replace("/login");
        return;
      }

      // プロフィール取得
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // 漫画一覧取得
      const { data } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setProfile(p);
      setMangas(data ?? []);
      setLoading(false);
    };

    load();
  }, [router, supabase]);

  const filtered = mangas.filter((m) =>
    m.title?.toLowerCase().includes(keyword.toLowerCase())
  );

  if (loading) return <div className="p-10">読み込み中…</div>;

  return (
    <main className="max-w-6xl mx-auto px-6 space-y-8">
      <section className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow">
          総話数
          <div className="text-3xl font-bold text-sky-600">
            {profile?.total_chapters ?? 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          登録作品数
          <div className="text-3xl font-bold text-emerald-600">
            {profile?.total_registered ?? 0}
          </div>
        </div>
      </section>

      <SearchBar value={keyword} onChange={setKeyword} />

      <section className="bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-lg p-6">
        <MangaTable mangas={filtered} reload={() => location.reload()} />
      </section>
    </main>
  );
}
