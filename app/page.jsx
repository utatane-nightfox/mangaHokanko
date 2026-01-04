"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";
import MangaTable from "@/components/MangaTable";

// 🔽 ここで一度だけ作る（超重要）
const supabase = supabaseBrowser();

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [mangas, setMangas] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      // セッション取得
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 未ログイン → ログインへ
      if (!session) {
        router.replace("/login");
        return;
      }

      const userId = session.user.id;

      // プロフィール
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // 漫画一覧
      const { data: list } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!ignore) {
        setProfile(p);
        setMangas(list || []);
        setLoading(false);
      }
    };

    load();

    // auth状態変化も監視（マジックリンク対策）
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <div className="p-10">読み込み中...</div>;
  }

  return (
    <main className="p-10 space-y-6">
      {/* ステータス */}
      <div className="flex gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          総話数<br />
          <b className="text-2xl">{profile?.total_chapters ?? 0}</b>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          登録作品数<br />
          <b className="text-2xl">{profile?.total_registered ?? 0}</b>
        </div>
      </div>

      {/* 一覧 */}
      <MangaTable
        mangas={mangas}
        reload={() => window.location.reload()}
      />
    </main>
  );
}
