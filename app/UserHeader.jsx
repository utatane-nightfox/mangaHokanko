"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [iconFrame, setIconFrame] = useState("none");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [totalChapters, setTotalChapters] = useState(0);
  const [totalRegistered, setTotalRegistered] = useState(0);

  // ------------------------
  // ユーザー & プロフィール読込
  // ------------------------
  const loadUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data?.session) return;

    const user = data.session.user;
    setUserId(user.id);
    setEmail(user.email ?? "");

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "nickname, icon_frame, current_title, total_chapters, total_registered, avatar_url"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("profile load error:", error);
      return;
    }

    if (!profile) return;

    setNickname(profile.nickname ?? "");
    setIconFrame(profile.icon_frame ?? "none");
    setCurrentTitle(profile.current_title ?? "");
    setTotalChapters(profile.total_chapters ?? 0);
    setTotalRegistered(profile.total_registered ?? 0);
    setAvatarUrl(profile.avatar_url ?? null);
  };

  // 初回ロード
  useEffect(() => {
    loadUser();
  }, []);

  // リアルタイム更新（profiles）
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("profiles-watch")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        () => {
          loadUser();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // ログアウト
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 right-0 z-50">
      <div className="m-3 bg-white shadow-md rounded-2xl p-2 flex items-center">
        <div className="relative">
          {/* アイコン */}
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className={`w-10 h-10 flex items-center justify-center border-2 rounded-full cursor-pointer ${iconFrame}`}
            title={nickname || email}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </div>

          {/* メニュー */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg text-sm overflow-hidden">
              {/* 上部情報 */}
              <div className="px-4 py-3 bg-sky-50">
                <div className="font-bold truncate">
                  {nickname || email}
                </div>
                {currentTitle && (
                  <div className="text-xs text-sky-600 mt-1">
                    {currentTitle}
                  </div>
                )}
              </div>

              {/* ステータス */}
              <div className="px-4 py-2 text-xs text-gray-600 border-t">
                📖 合計話数：{totalChapters}
                <br />
                📚 登録数：{totalRegistered}
              </div>

              {/* プロフィール */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/profile");
                }}
                className="w-full text-left px-4 py-2 hover:bg-sky-50"
              >
                プロフィール
              </button>

              {/* ログアウト */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
