"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 プロフィール情報を読み込み
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = "/login";
          return;
        }

        const user = session.user;

        // profilesテーブルから必要情報を取得
        const { data, error } = await supabase
          .from("profiles")
          .select(
            `
            nickname,
            icon_frame,
            avatar_url,
            total_chapters,
            total_registered,
            title_unlocked,
            current_title
          `
          )
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("プロフィール情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-6 text-center">読み込み中...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!profile) return null;

  const {
    nickname,
    icon_frame,
    avatar_url,
    total_chapters,
    total_registered,
    title_unlocked = [],
    current_title,
  } = profile;

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      {/* 🌟 プロフィールセクション */}
      <section className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`relative w-16 h-16 flex items-center justify-center border-2 rounded-full ${icon_frame}`}
          >
            {avatar_url ? (
              <img
                src={avatar_url}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {nickname || "名無しの読書家"}
            </h2>
            <p className="text-gray-500">
              現在の称号：{current_title || "称号なし"}
            </p>
          </div>
        </div>
      </section>

      {/* 📊 統計情報 */}
      <section className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">📚 現在の進捗</h3>
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">
              {total_chapters || 0}
            </p>
            <p className="text-gray-500">合計話数</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">
              {total_registered || 0}
            </p>
            <p className="text-gray-500">合計登録数</p>
          </div>
        </div>
      </section>

      {/* 🏅 称号リスト */}
      <section className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">🏅 獲得済み称号</h3>
        {title_unlocked.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {title_unlocked.map((title, idx) => (
              <li
                key={idx}
                className="bg-gray-100 border rounded-lg px-3 py-2 text-center hover:bg-yellow-50 transition"
              >
                {title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">まだ称号はありません。</p>
        )}
      </section>
    </main>
  );
}
