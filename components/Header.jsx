"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
        .select("*")
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
    <header className="bg-sky-400 p-4 flex justify-between items-center">
      <nav className="flex gap-6 mx-auto">
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

      {profile && (
        <div className="relative mr-4">
          <div
            onClick={() => setOpen(!open)}
            className={`w-10 h-10 rounded-full cursor-pointer ${profile.icon_frame}`}
          >
            <img
              src={profile.avatar_url || "/avatar.png"}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow">
              <button
                onClick={() => router.push("/profile")}
                className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
              >
                プロフィール
              </button>
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-red-500 hover:bg-red-50 text-left"
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
