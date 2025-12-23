"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserIcon() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);

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

  if (!profile) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        <img
          src={`${profile.avatar_url || "/avatar.png"}?t=${Date.now()}`}
          className="w-12 h-12 rounded-full border-2 border-white shadow"
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
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
