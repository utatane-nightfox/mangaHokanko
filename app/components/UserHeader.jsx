"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const ref = useRef(null);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      setUser(data.session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("nickname, current_title")
        .eq("id", data.session.user.id)
        .single();

      setProfile(profileData);
    };
    load();
  }, []);

  // 外クリックで閉じる
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="relative" ref={ref}>
      {/* アイコン */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center text-xl shadow"
      >
        👤
      </button>

      {/* メニュー */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border">
          <div className="px-4 py-3 border-b">
            <p className="font-bold text-sm">
              {profile?.nickname || user?.email}
            </p>
            {profile?.current_title && (
              <p className="text-xs text-sky-500 mt-1">
                {profile.current_title}
              </p>
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
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
