"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("/avater.png"); // デフォルト

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      setUser(data.user);

      // user_metadata に avatar_url があれば上書き
      if (data.user.user_metadata?.avatar_url) {
        setAvatarUrl(data.user.user_metadata.avatar_url);
      }
    });
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-10 h-10 rounded-full border"
      />
      <span className="text-sm font-medium">
        {user.user_metadata?.name ?? "ユーザー"}
      </span>
    </div>
  );
}
