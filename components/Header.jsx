"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function Header() {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  return (
    <header className="bg-sky-400 p-4 flex justify-between items-center">
      <nav className="flex gap-4">
        <Link href="/" className="bg-white px-4 py-2 rounded-full">ホーム</Link>
        <Link href="/register" className="bg-white px-4 py-2 rounded-full">登録</Link>
        <Link href="/favorites" className="bg-white px-4 py-2 rounded-full">お気に入り</Link>
      </nav>

      {!user ? (
        <Link
          href="/login"
          className="bg-white px-4 py-2 rounded-full font-bold"
        >
          ログイン
        </Link>
      ) : (
        <Link href="/profile">
          <img
            src="/avatar.png"
            className="w-10 h-10 rounded-full"
          />
        </Link>
      )}
    </header>
  );
}
