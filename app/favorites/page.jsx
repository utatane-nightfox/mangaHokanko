"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../utils/supabase/client";
import MangaTable from "../../components/MangaTable";

export default function FavoritesPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      const user = session.user;

      const { data } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", user.id)
        .eq("favorite", true)
        .order("created_at", { ascending: false });

      setList(data ?? []);
      setLoading(false);
    };

    load();
  }, [router, supabase]);

  if (loading) return <div className="p-10">読み込み中…</div>;

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-bold">お気に入り</h1>
      <section className="bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-lg p-6">
        <MangaTable mangas={list} reload={() => location.reload()} />
      </section>
    </main>
  );
}
