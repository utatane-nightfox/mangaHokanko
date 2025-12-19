"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function ProfilePage() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      setProfile(p);
    });
  }, []);

  const upload = async (e) => {
    const file = e.target.files[0];
    const path = `${profile.id}/${file.name}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", profile.id);
    setProfile({ ...profile, avatar_url: url });
  };

  if (!profile) return null;

  return (
    <main className="p-6">
      <div className="bg-white p-6 rounded shadow">
        <img src={profile.avatar_url} className="w-24 h-24 rounded-full mx-auto" />
        <input type="file" onChange={upload} />
        <p className="text-center mt-2">称号：{profile.current_title || "なし"}</p>
      </div>
    </main>
  );
}
