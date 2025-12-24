"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Header() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };
    load();
  }, []);

  return (
    <header className="bg-sky-400 p-4 flex justify-between items-center">
      <nav className="flex gap-4">
        <Link href="/" className="px-4 py-2 bg-white rounded-full">一覧</Link>
        <Link href="/register" className="px-4 py-2 bg-white rounded-full">登録</Link>
        <Link href="/favorites" className="px-4 py-2 bg-white rounded-full">お気に入り</Link>
      </nav>

      {profile && (
        <div
          onClick={() => router.push("/profile")}
          className={`cursor-pointer ${profile.icon_frame}`}
        >
          <img
            src={profile.avatar_url || "/avatar.png"}
            className="w-10 h-10 rounded-full"
          />
          {profile.current_title && (
            <div className="text-xs text-center">
              {profile.current_title}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
