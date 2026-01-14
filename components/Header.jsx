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
        .select("*")
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
    <header className="fixed top-0 w-full bg-sky-400 z-50 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* ユーザー */}
        {profile && (
          <div className="relative">
            <button onClick={() => setOpen(!open)}>
              <img
                src={profile.avatar_url || "/avatar.png"}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            </button>
            {open && (
              <div className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow">
                <button
                  onClick={() => router.push("/profile")}
                  className="block w-full px-4 py-2"
                >
                  プロフィール
                </button>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-red-600 font-bold"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        )}

        {/* タブ */}
        <nav className="flex gap-4">
          {[
            ["/", "ホーム"],
            ["/register", "登録"],
            ["/favorites", "お気に入り"],
            ["/storage", "保管庫"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="px-5 py-2 bg-white rounded-full font-bold shadow"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
