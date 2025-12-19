"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function RootLayout({ children }) {
  const supabase = supabaseBrowser();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", session.user.id)
        .single();

      setAvatar(data?.avatar_url ?? null);
    };
    load();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    location.href = "/login";
  };

  return (
    <html lang="ja">
      <body className="bg-sky-50">
        <header className="bg-sky-200 px-6 py-3 flex justify-between items-center">
          <nav className="flex gap-4">
            <Link href="/" className="font-bold">ホーム</Link>
            <Link href="/register">登録</Link>
            <Link href="/favorites">お気に入り</Link>
          </nav>

          <div className="relative group">
            <img
              src={avatar || "/user.png"}
              className="w-10 h-10 rounded-full border cursor-pointer"
            />
            <div className="hidden group-hover:block absolute right-0 mt-2 bg-white shadow rounded">
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                プロフィール
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                ログアウト
              </button>
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
