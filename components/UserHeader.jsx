"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const [avatarUrl, setAvatarUrl] = useState("/avater.png");

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", session.user.id)
        .single();

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="flex items-center gap-3">
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-10 h-10 rounded-full border"
      />
    </div>
  );
}
