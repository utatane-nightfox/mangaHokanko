"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function ProfileMenu() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) return;

      setUser(data.session.user);

      const { data: prof } = await supabase
        .from("profiles")
        .select("nickname, current_title, icon_frame, avatar_url")
        .eq("id", data.session.user.id)
        .maybeSingle();

      setProfile(prof);
    };

    load();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="relative">
      {/* アイコン */}
      <div
        onClick={() => setOpen(!open)}
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center cursor-pointer bg-white ${
          profile?.icon_frame || ""
        }`}
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-xl">👤</span>
        )}
      </div>

      {/* メニュー */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border">
          <div className="px-4 py-3 border-b">
            <div className="font-bold">
              {profile?.nickname || user?.email}
            </div>
            {profile?.current_title && (
              <div className="text-xs text-sky-600">
                {profile.current_title}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
            className="w-full text-left px-4 py-2 hover:bg-sky-50"
          >
            プロフィール
          </button>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
