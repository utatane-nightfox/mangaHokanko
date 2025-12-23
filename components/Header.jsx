"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Header() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [avatar, setAvatar] = useState("/avatar.png");
  const [open, setOpen] = useState(false);

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

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-teal-200">
      <nav className="flex gap-4">
        <Link href="/">ホーム</Link>
        <Link href="/register">登録</Link>
        <Link href="/favorites">お気に入り</Link>
      </nav>

      <div className="relative">
        <button onClick={() => setOpen(!open)}>
          <img
            src={avatar}
            className="w-10 h-10 rounded-full border object-cover"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow">
            <button
              onClick={() => router.push("/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              プロフィール
            </button>
            <button
              onClick={logout}
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
