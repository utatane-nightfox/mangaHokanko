"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();

      // 🔴 未ログインならログイン画面へ
      if (!data.user) {
        router.replace("/login");
        return;
      }

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setProfile(p);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-10">読み込み中…</div>;
  }

  return (
    <main className="p-10 flex gap-6">
      <div className="bg-white rounded-xl p-6 shadow">
        総話数<br />
        <b className="text-2xl">{profile.total_chapters}</b>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        登録作品数<br />
        <b className="text-2xl">{profile.total_registered}</b>
      </div>
    </main>
  );
}
