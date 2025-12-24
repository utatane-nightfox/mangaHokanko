"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setProfile(p);
    };
    load();
  }, []);

  if (!profile) return <div className="p-10">ログインしてください</div>;

  return (
    <main className="p-10 space-y-6">
      <div className="flex gap-6">
        <div className="bg-white rounded-2xl p-6 shadow">
          総話数<br />
          <b className="text-2xl">{profile.total_chapters}</b>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          登録数<br />
          <b className="text-2xl">{profile.total_registered}</b>
        </div>
      </div>

      {/* ※ 漫画一覧は MangaTable.jsx 側で表示 */}
    </main>
  );
}
