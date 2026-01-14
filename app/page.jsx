"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../utils/supabase/client";
import MangaTable from "../components/MangaTable";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [mangas, setMangas] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ セッション確認は getUser() のみ
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(p);

        const { data: list } = await supabase
          .from("mangas")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setMangas(list || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router, supabase]);

  if (loading) return <div className="p-10">読み込み中...</div>;

  return (
    <main className="p-10 space-y-6">
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

      <MangaTable mangas={mangas} reload={() => location.reload()} />
    </main>
  );
}
