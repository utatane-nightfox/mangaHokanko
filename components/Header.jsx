"use client";

import Link from "next/link";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Header() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="bg-sky-400 p-4 flex justify-between items-center">
      <nav className="flex gap-6">
        <Link href="/">ホーム</Link>
        <Link href="/register">登録</Link>
        <Link href="/favorites">お気に入り</Link>
        <Link href="/profile">プロフィール</Link>
      </nav>

      <button
        onClick={logout}
        className="bg-white px-4 py-2 rounded-full shadow"
      >
        ログアウト
      </button>
    </header>
  );
}
