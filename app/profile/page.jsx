"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function ProfilePage() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(data);
    };
    load();
  }, []);

  const upload = async (e) => {
    const file = e.target.files[0];
    const path = `${profile.id}/${file.name}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", profile.id);

    setProfile({ ...profile, avatar_url: data.publicUrl });
  };

  if (!profile) return null;

  return (
    <main className="p-6">
      <img src={profile.avatar_url || "/user.png"} className="w-24 h-24 rounded-full" />
      <input type="file" onChange={upload} />

      <p className="mt-4">称号：{profile.current_title || "なし"}</p>
    </main>
  );
}
