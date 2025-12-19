"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* アイコン（デフォルト人型） */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl"
      >
        👤
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg p-3">
          <p className="text-center font-bold mb-2">プロフィール</p>

          <button
            className="w-full text-red-500 font-bold"
            onClick={async () => {
              await supabase.auth.signOut();
              location.reload();
            }}
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
