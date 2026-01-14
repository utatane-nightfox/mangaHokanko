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

      setProfile(p);

      const { data } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setMangas(data || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="p-10">読み込み中…</div>;

  return (
    <main className="max-w-6xl mx-auto px-6 space-y-6">
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow">
          総話数
          <div className="text-2xl font-bold">{profile?.total_chapters}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          登録作品数
          <div className="text-2xl font-bold">{profile?.total_registered}</div>
        </div>
      </section>

      <SearchBar value={keyword} onChange={setKeyword} />

      <section className="bg-white rounded-xl shadow p-4">
        <MangaTable mangas={mangas} reload={() => location.reload()} />
      </section>
    </main>
  );
}
