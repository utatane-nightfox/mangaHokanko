"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function Header() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("avatar_url, current_title, icon_frame")
        .eq("id", data.user.id)
        .single();

      setProfile(p);
    };
    load();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-sky-400 shadow">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">

        {/* 上部タブ */}
        <nav className="flex gap-4">
          {[
            { href: "/", label: "ホーム" },
            { href: "/register", label: "登録" },
            { href: "/favorites", label: "お気に入り" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-6 py-2 bg-white rounded-full font-bold shadow hover:bg-sky-100"
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {/* プロフィール */}
        {profile && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${profile.icon_frame}`}
            >
              <img
                src={profile.avatar_url || "/avatar.png"}
                className="w-full h-full rounded-full object-cover"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow text-sm">
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/profile");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-sky-100"
                >
                  プロフィール
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                >
                  ログアウト
                </button>
              </div>
            )}

            {profile.current_title && (
              <div className="text-xs text-center mt-1 text-white">
                {profile.current_title}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
