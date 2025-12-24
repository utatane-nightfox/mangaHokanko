"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function Header() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("nickname, avatar_url, icon_frame, current_title")
        .eq("id", data.user.id)
        .single();

      setProfile(p);
    };
    load();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-sky-400 shadow z-50">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* ナビ */}
        <nav className="flex gap-6">
          {[
            { href: "/", label: "ホーム" },
            { href: "/register", label: "登録" },
            { href: "/favorites", label: "お気に入り" },
          ].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-6 py-2 bg-white rounded-full font-bold shadow"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* プロフィール */}
        {profile && (
          <div className="relative">
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center ${profile.icon_frame}`}
            >
              <img
                src={profile.avatar_url || "/avatar.png"}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow overflow-hidden text-sm">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-sky-50"
                >
                  プロフィール
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-100"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
