"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "../utils/supabase/client";

const tabs = [
  { href: "/", label: "ホーム" },
  { href: "/register", label: "登録" },
  { href: "/favorites", label: "お気に入り" },
  { href: "/vault", label: "保管庫" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = supabaseBrowser();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-300 to-sky-300 shadow">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左：アイコン */}
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow cursor-pointer">
            🦊
          </div>
        </Link>

        {/* 中央：タブ */}
        <nav className="flex gap-3">
          {tabs.map(t => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-4 py-2 rounded-full text-sm font-bold transition
                  ${active
                    ? "bg-white text-sky-600 shadow"
                    : "text-white hover:bg-white/30"
                  }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* 右：ログアウト */}
        <button
          onClick={logout}
          className="text-sm text-red-600 bg-white px-3 py-1 rounded-full shadow hover:bg-red-50"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
