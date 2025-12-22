"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import Link from "next/link";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("avatar_url, current_title")
        .eq("id", data.session.user.id)
        .single();

      setProfile(p);
    };
    load();
  }, []);

  if (!profile) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        <img
          src={profile.avatar_url || "/avatar.png"}
          className="w-10 h-10 rounded-full border"
          alt="avatar"
        />
      </button>

      {/* 称号表示（アイコン下） */}
      {profile.current_title && (
        <div className="text-xs text-center mt-1">
          {profile.current_title}
        </div>
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow">
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            プロフィール
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              location.href = "/login";
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
