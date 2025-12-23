"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function Header() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);

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

  return (
    <header className="bg-sky-400 p-4 flex justify-between items-center">
      <nav className="flex gap-6 mx-auto">
        {[
          ["/", "ホーム"],
          ["/register", "登録"],
          ["/favorites", "お気に入り"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="px-6 py-2 bg-white rounded-full text-lg font-bold shadow"
          >
            {label}
          </Link>
        ))}
      </nav>

      {profile && (
        <div className="text-center">
          <div className={`avatar-wrapper ${profile.icon_frame}`}>
            <img
              src={profile.avatar_url || "/avatar.png"}
              className="avatar-img"
            />
          </div>
          {profile.current_title && (
            <div className="text-xs mt-1">{profile.current_title}</div>
          )}
        </div>
      )}
    </header>
  );
}
