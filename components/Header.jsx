"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function Header() {
  const supabase = supabaseBrowser();
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState("/avatar.png");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", data.session.user.id)
        .single();

      if (profile?.avatar_url) setAvatar(profile.avatar_url);
    };
    load();
  }, []);

  return (
    <header className="fixed top-0 w-full h-14 bg-sky-300 flex items-center justify-between px-6 z-50">
      <nav className="flex gap-4 text-black">
        <Link href="/">ホーム</Link>
        <Link href="/register">登録</Link>
        <Link href="/favorites">お気に入り</Link>
      </nav>

      {/* アイコンはこれ1個だけ */}
      <div className="relative">
        <button onClick={() => setOpen(!open)}>
          <img
            src={avatar}
            className="w-10 h-10 rounded-full border bg-white"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow">
            <Link
              href="/profile"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              プロフィール
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                location.href = "/login";
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
