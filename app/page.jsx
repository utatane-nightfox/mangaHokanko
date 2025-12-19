"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import Link from "next/link";
import UserHeader from "@/app/components/UserHeader";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const [session, setSession] = useState(null);
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  const fetchMangas = async (userId) => {
    setLoading(true);
    const { data } = await supabase
      .from("manga_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setMangas(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!session) return;
    fetchMangas(session.user.id);
  }, [session]);

  if (!session) {
    return <div className="p-6">ログイン確認中…</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-green-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-600">📚 Manga管理</h1>
        <UserHeader />
      </header>

      <Link
        href="/register"
        className="inline-block mb-4 px-4 py-2 rounded-full bg-sky-400 text-white shadow hover:bg-sky-500"
      >
        ＋ 登録
      </Link>
    </main>
  );
}
