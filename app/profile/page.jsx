"use client";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function ProfilePage() {
  const supabase = supabaseBrowser();
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const saveAvatar = async () => {
    if (!file || !user) return;

    const path = `${user.id}/avatar.png`;

    await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", user.id);

    alert("保存しました");
    location.reload();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">プロフィール</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={saveAvatar}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        保存
      </button>
    </div>
  );
}
