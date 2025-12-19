"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-10 h-10 rounded-full bg-sky-300 flex items-center justify-center cursor-pointer"
      >
        👤
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow p-2">
          <button
            onClick={() => router.push("/profile")}
            className="block w-full text-left px-3 py-2 hover:bg-sky-100 rounded"
          >
            プロフィール
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 rounded"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
