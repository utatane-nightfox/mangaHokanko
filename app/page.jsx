"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";
import MangaTable from "@/components/MangaTable";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.replace("/login");
        return;
      }

      const userId = data.session.user.id;

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const { data: list } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setProfile(p);
      setMangas(list || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="p-10">読み込み中...</div>;

  return (
    <main className="p-10 space-y-6">
      <div className="flex gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          総話数<br />
          <b className="text-2xl">{profile.total_chapters}</b>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          登録作品数<br />
          <b className="text-2xl">{profile.total_registered}</b>
        </div>
      </div>

      <MangaTable mangas={mangas} reload={() => location.reload()} />
    </main>
  );
}
