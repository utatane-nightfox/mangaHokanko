"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useState } from "react";

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [open, setOpen] = useState(false);

  const tabs = [
    { href: "/", label: "ホーム" },
    { href: "/register", label: "登録" },
    { href: "/favorites", label: "お気に入り" },
  ];

  return (
    <header className="fixed top-0 w-full bg-sky-300 z-50">
      <div className="flex items-center justify-between px-6 py-3 max-w-5xl mx-auto">
        {/* タブ */}
        <nav className="flex gap-4 flex-1 justify-center">
          {tabs.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition
                ${path === t.href ? "bg-white shadow" : "bg-sky-200 hover:bg-white"}
              `}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {/* ユーザーアイコン（これ1個だけ） */}
        <div className="relative">
          <button onClick={() => setOpen(!open)}>
            <img
              src="/avatar.png"
              className="w-10 h-10 rounded-full border"
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow">
              <button
                onClick={() => router.push("/profile")}
                className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
              >
                プロフィール
              </button>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/login");
                }}
                className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
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
