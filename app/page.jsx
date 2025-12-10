"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/utils/supabase/client";

export default function HomePage() {
  const [session, setSession] = useState(undefined); // ← undefined で「読み込み中」を区別
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- セッションを確実に取得 ---
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      // セッション変更を監視
      supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
      });
    };

    loadSession();
  }, []);

  // --- session が確定してから fetch ---
  useEffect(() => {
    // session が undefined の時はまだ読み込み中
    if (session === undefined) return;

    // 未ログイン
    if (session === null) {
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = session.access_token;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-or-create-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("取得失敗");

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("プロフィール情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  // --- 画面表示 ---
  if (session === undefined) return <div>セッション確認中…</div>;
  if (loading) return <div>読み込み中…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
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
      {/* プロフィール */}
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
            <h2 className="text-xl font-bold">{nickname || "名無しの読書家"}</h2>
            <p className="text-gray-500">
              現在の称号：{current_title || "なし"}
            </p>
          </div>
        </div>
      </section>

      {/* 統計 */}
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

      {/* 称号 */}
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
