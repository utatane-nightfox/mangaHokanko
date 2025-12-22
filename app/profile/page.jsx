"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function ProfilePage() {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };
    load();
  }, []);

  // 🔽 ここが質問されてた upload 処理
  const saveAvatar = async () => {
    if (!file || !user) return;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(`${user.id}/avatar.png`, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      alert("アップロード失敗");
      console.error(error);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${user.id}/avatar.png`);

    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", user.id);

    alert("保存しました");
    location.reload();
  };

  if (loading) return <div className="p-6">読み込み中…</div>;

  return (
    <main className="min-h-screen flex justify-center items-start pt-20">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          プロフィール
        </h1>

        {/* アイコン */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={profile?.avatar_url || "/avatar.png"}
            className="w-32 h-32 rounded-full border"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            onClick={saveAvatar}
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            保存
          </button>
        </div>

        {/* 称号枠（大きめ） */}
        <div className="mt-10 p-6 border rounded-xl">
          <h2 className="font-bold mb-3">称号</h2>
          <p className="text-gray-500">
            条件達成でここに増えていきます
          </p>
        </div>
      </div>
    </main>
  );
}
