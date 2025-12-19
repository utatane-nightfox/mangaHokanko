"use client";
import Link from "next/link";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Header() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-teal-200">
      <div className="flex gap-4">
        <Link href="/">ホーム</Link>
        <Link href="/register">登録</Link>
        <Link href="/favorites">お気に入り</Link>
      </div>

      <div className="relative">
        <button
          onClick={() => {
            const v = confirm("プロフィールに行きますか？\nキャンセルでログアウト");
            if (v) router.push("/profile");
            else logout();
          }}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
        >
          👤
        </button>
      </div>
    </header>
  );
}
