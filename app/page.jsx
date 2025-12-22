"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserHeader from "@/components/UserHeader";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [session, setSession] = useState(undefined); // undefined = 確認中

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        // 🔥 未ログインなら強制ログイン画面へ
        router.replace("/login");
        return;
      }

      setSession(data.session);
    });
  }, [router, supabase]);

  // 確認中
  if (session === undefined) {
    return <div className="p-6">ログイン確認中…</div>;
  }

  // ここに来る時点でログイン確定
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-green-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-600">📚 Manga管理</h1>
        <UserHeader user={session.user} />
      </header>

      <Link
        href="/register"
        className="inline-block mb-4 px-4 py-2 rounded-full bg-sky-400 text-white shadow hover:bg-sky-500"
      >
        ＋ 登録
      </Link>
    </main>
  );
}
