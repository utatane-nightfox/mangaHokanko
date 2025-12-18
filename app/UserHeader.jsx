"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const [email, setEmail] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [iconFrame, setIconFrame] = useState("none");
  const [currentTitle, setCurrentTitle] = useState(null);
  const [totalChapters, setTotalChapters] = useState(0);
  const [totalRegistered, setTotalRegistered] = useState(0);

  const [popup, setPopup] = useState(null);

  // ------------------------
  // ユーザー & プロフィール読込
  // ------------------------
  const loadUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data?.session) return;

    const user = data.session.user;
    setUserId(user.id);
    setEmail(user.email);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "nickname, icon_frame, current_title, total_chapters, total_registered"
      )
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      console.error("profile load error:", error);
      return;
    }

    setNickname(profile.nickname);
    setIconFrame(profile.icon_frame || "none");
    setCurrentTitle(profile.current_title);
    setTotalChapters(profile.total_chapters || 0);
    setTotalRegistered(profile.total_registered || 0);
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
    <>
      <header className="fixed top-0 right-0 z-50">
        <div className="m-3 bg-white shadow-md rounded-2xl p-3 flex items-center gap-3">
          <div className="relative">
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-10 h-10 flex items-center justify-center border-2 rounded-full cursor-pointer ${iconFrame}`}
              title={nickname || email}
            >
              👤
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg text-sm">
                <div className="px-4 py-3 border-b">
                  <div className="font-bold">
                    {nickname || email}
                  </div>
                  {currentTitle && (
                    <div className="text-xs text-blue-600 mt-1">
                      {currentTitle}
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 text-xs text-gray-600 border-b">
                  📖 合計話数：{totalChapters}
                  <br />
                  📚 登録数：{totalRegistered}
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  プロフィール
                </button>

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

      {popup && (
        <div className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
          {popup}
        </div>
      )}
    </>
  );
}
