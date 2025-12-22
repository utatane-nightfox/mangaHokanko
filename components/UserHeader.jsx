"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserHeader() {
  const supabase = supabaseBrowser();
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

  if (!profile) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        <img
          src={profile.avatar_url || "/avatar.png"}
          className="w-10 h-10 rounded-full border"
          {...profile?.current_title && (
  <div className="text-sm text-gray-600 text-center">
    {profile.current_title}
  </div>
)}

        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow">
          <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
            プロフィール
          </a>
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
