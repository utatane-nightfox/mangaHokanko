"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import Link from "next/link";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        <img
          src="/avatar.png"
          className="w-10 h-10 rounded-full border"
          alt="avatar"
        />
      </button>

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
