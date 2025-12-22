"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function ProfilePage() {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUser(data.user);

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setProfile(p);
    };
    load();
  }, []);

  const saveAvatar = async () => {
    if (!file || !user) return;

    setSaving(true);

    /* =========================
       ① storage に上書き
    ========================= */
    await supabase.storage
      .from("avatars")
      .upload(`${user.id}/avatar.png`, file, {
        upsert: true,
        contentType: file.type,
      });

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${user.id}/avatar.png`);

    /* =========================
       ② profiles にURL保存
    ========================= */
    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", user.id);

    setProfile({ ...profile, avatar_url: data.publicUrl });
    setSaving(false);
  };

  if (!profile) return null;

  return (
    <main className="min-h-screen flex justify-center pt-24">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-6">プロフィール</h1>

        <img
          src={profile.avatar_url || "/avatar.png"}
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={saveAvatar}
          disabled={saving}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          {saving ? "保存中…" : "保存"}
        </button>
      </div>
    </main>
  );
}
