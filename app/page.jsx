"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import Link from "next/link";
import UserHeader from "@/components/UserHeader";

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

  if (!session) return <div className="p-6">ログイン確認中…</div>;

  const totalChapters = mangas.reduce((a, b) => a + b.chapters, 0);
  const totalTitles = mangas.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-green-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-600">📚 Manga管理</h1>
        <UserHeader />
      </header>

      <section className="bg-white rounded-xl shadow p-4 mb-4">
        <p>📖 合計話数：<b>{totalChapters}</b></p>
        <p>📚 登録作品数：<b>{totalTitles}</b></p>
      </section>

      <Link
        href="/register"
        className="inline-block mb-4 px-4 py-2 rounded-full bg-sky-400 text-white shadow hover:bg-sky-500"
      >
        ＋ 登録
      </Link>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="font-bold mb-2">一覧</h2>

        {loading ? (
          <p>読み込み中…</p>
        ) : mangas.length === 0 ? (
          <p className="text-gray-500">まだ登録されていません</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th>タイトル</th>
                <th>話数</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {mangas.map((m) => (
                <tr key={m.id} className="border-b">
                  <td>{m.title}</td>
                  <td>{m.chapters}</td>
                  <td>
                    <button
                      className="text-red-500"
                      onClick={async () => {
                        await supabase
                          .from("manga_logs")
                          .delete()
                          .eq("id", m.id);
                        fetchMangas(session.user.id);
                      }}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
