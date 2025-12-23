"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function Header() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);

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

  return (
    <header className="fixed top-0 w-full bg-sky-400 p-4 flex justify-between items-center z-50">
      <nav className="flex gap-4">
        <Link href="/" className="px-4 py-2 bg-white rounded-full">一覧</Link>
        <Link href="/register" className="px-4 py-2 bg-white rounded-full">登録</Link>
        <Link href="/favorites" className="px-4 py-2 bg-white rounded-full">お気に入り</Link>
      </nav>

      {profile && (
        <div className="text-center text-sm">
          <img
            src={profile.avatar_url || "/avatar.png"}
            className="w-10 h-10 rounded-full mx-auto"
          />
          {profile.current_title && (
            <div className="text-xs mt-1">{profile.current_title}</div>
          )}
        </div>
      )}
    </header>
  );
}
