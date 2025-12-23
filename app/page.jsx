"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import Header from "@/components/Header";
import MangaTable from "@/components/MangaTable";
import Link from "next/link";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const [session, setSession] = useState(null);
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  const fetchMangas = async (userId) => {
    const { data } = await supabase
      .from("mangas") // ← 絶対に mangas
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setMangas(data ?? []);
  };

  useEffect(() => {
    if (!session) return;
    fetchMangas(session.user.id);
  }, [session]);

  if (loading) return <div className="p-6">確認中…</div>;
  if (!session) return <div className="p-6">ログインしてください</div>;

  return (
    <>
      <Header />

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">📚 Manga管理</h1>

        <Link
          href="/register"
          className="inline-block mb-4 px-4 py-2 rounded bg-sky-400 text-white"
        >
          ＋ 登録
        </Link>

        <MangaTable mangas={mangas} reload={() => fetchMangas(session.user.id)} />
      </main>
    </>
  );
}
