"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import Link from "next/link";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const [avatarUrl, setAvatarUrl] = useState("/avatar.png");

  useEffect(() => {
    const loadAvatar = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      // 将来 user_metadata.avatar_url があればそっちを使う
      const userAvatar = session.user.user_metadata?.avatar_url;
      if (userAvatar) {
        setAvatarUrl(userAvatar);
      }
    };

    loadAvatar();
  }, []);

  return (
    <div className="flex items-center gap-3">
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-10 h-10 rounded-full border"
      />

      <Link
        href="/profile"
        className="text-sm text-sky-600 hover:underline"
      >
        プロフィール
      </Link>

      <button
        className="text-sm text-red-500"
        onClick={async () => {
          await supabase.auth.signOut();
          location.reload();
        }}
      >
        ログアウト
      </button>
    </div>
  );
}
