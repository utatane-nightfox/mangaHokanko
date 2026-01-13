"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../utils/supabase/client";

export default function Header() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("avatar_url, current_title, icon_frame")
        .eq("id", data.user.id)
        .single();
      setProfile(p);
    });
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-sky-400 shadow">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        <nav className="flex gap-4 flex-1 justify-center">
          {[
            { href: "/", label: "ホーム" },
            { href: "/register", label: "登録" },
            { href: "/favorites", label: "お気に入り" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-6 py-2 bg-white rounded-full font-bold shadow"
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {profile && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className={`w-12 h-12 rounded-full border-2 ${profile.icon_frame}`}
            >
              <img
                src={profile.avatar_url || "/avatar.png"}
                className="w-full h-full rounded-full"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow">
                <button
                  onClick={() => router.push("/profile")}
                  className="block w-full px-4 py-2"
                >
                  プロフィール
                </button>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-red-600"
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
