"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <div className="relative">
      {/* アイコン */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        <img
          src="/avatar.png"
          alt="avatar"
          className="w-10 h-10 rounded-full border"
        />
      </button>

      {/* メニュー */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow">
          <a
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            プロフィール
          </a>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              location.reload();
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
