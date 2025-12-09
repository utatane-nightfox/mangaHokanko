"use client";

import "./globals.css";
import '../lib/frameStyles.css';
import { createServerSupabase } from "@/utils/supabaseServer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function RootLayout({ children }) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [iconFrame, setIconFrame] = useState("none");
  const [menuOpen, setMenuOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [totalChapters, setTotalChapters] = useState(0);
  const [totalManga, setTotalManga] = useState(0);
  const [showTitlePopup, setShowTitlePopup] = useState(null);
  const [userId, setUserId] = useState(null);

  // ✅ 称号ロジック
  const getReadingTitle = (chapters) => {
    if (chapters >= 100000) return "伝導者";
    if (chapters >= 10000) return "プロ読書家";
    if (chapters >= 5000) return "中堅読書家";
    if (chapters >= 1000) return "一般読書家";
    if (chapters >= 100) return "見習い読書家";
    return null;
  };

  const getResearchTitle = (manga) => {
    if (manga >= 1000) return "究明者";
    if (manga >= 500) return "王宮所属研究家";
    if (manga >= 100) return "図書館所属研究家";
    if (manga >= 10) return "放浪研究家";
    return null;
  };

  // ✅ ユーザー情報ロード
  const loadUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push("/login");
      return;
    }

    const user = data.session.user;
    setUserEmail(user.email);
    setUserId(user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname, icon_frame, total_chapters, total_registered, current_title")
      .eq("id", user.id)
      .single();

    if (profile) {
      setNickname(profile.nickname);
      setIconFrame(profile.icon_frame || "none");
      setTotalChapters(profile.total_chapters || 0);
      setTotalManga(profile.total_manga || 0);
      setTitle(profile.title || null);

      // ✅ 新称号チェック
      const newReadingTitle = getReadingTitle(profile.total_chapters);
      const newResearchTitle = getResearchTitle(profile.total_manga);
      let newTitle = null;

      if (profile.total_chapters >= 100000 && profile.total_manga >= 1000) {
        newTitle = "漫画王";
      } else if (newReadingTitle) {
        newTitle = newReadingTitle;
      } else if (newResearchTitle) {
        newTitle = newResearchTitle;
      }

      if (newTitle && newTitle !== profile.title) {
        await supabase
          .from("profiles")
          .update({ title: newTitle })
          .eq("id", user.id);

        setTitle(newTitle);
        setShowTitlePopup(`🎉 新しい称号「${newTitle}」を獲得しました！`);
        setTimeout(() => setShowTitlePopup(null), 5000);
      }
    }
  };

  // ✅ 初回ロード
  useEffect(() => {
    loadUser();
  }, [router]);

  // ✅ 🔄 リアルタイム更新
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        async (payload) => {
          console.log("🔔 Profile updated:", payload);
          await loadUser(); // 変更があったら再読み込み
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // ✅ ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        {/* 🌟 ヘッダー */}
        <header className="fixed top-0 right-0 bg-white shadow-md p-3 rounded-bl-2xl flex items-center gap-3 z-50">
          <div className="relative">
            {/* 👤 アイコン */}
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-10 h-10 flex items-center justify-center border-2 border-gray-400 rounded-full cursor-pointer hover:scale-105 transition ${iconFrame}`}
              title={nickname || userEmail}
            >
              👤
            </div>

            {/* ▼ メニュー */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-52 text-sm z-50">
                <div className="px-3 py-2 border-b text-gray-600">
                  <div className="font-semibold">{nickname || userEmail}</div>
                  {title && (
                    <div className="text-xs text-blue-600 mt-1">{title}</div>
                  )}
                </div>
                <div className="px-3 py-2 text-gray-600 text-xs border-b">
                  📖 合計話数：{totalChapters}
                  <br />
                  📚 登録作品：{totalManga}
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  プロフィール
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-100"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ✅ 称号ポップアップ */}
        {showTitlePopup && (
          <div className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg animate-bounce z-50">
            {showTitlePopup}
          </div>
        )}

        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
