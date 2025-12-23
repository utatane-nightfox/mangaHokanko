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

  if (!profile) return null;

  return (
    <main className="p-10 flex gap-6">
      <div className="bg-white rounded-xl p-6 shadow text-center">
        <div>総話数</div>
        <b className="text-2xl">{profile.total_chapters}</b>
      </div>

      <div className="bg-white rounded-xl p-6 shadow text-center">
        <div>登録作品数</div>
        <b className="text-2xl">{profile.total_registered}</b>
      </div>
    </main>
  );
}
