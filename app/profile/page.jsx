"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function ProfilePage() {
  const supabase = supabaseBrowser();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  /* =========================
     初期ロード
  ========================= */
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

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

  /* =========================
     アバター保存
  ========================= */
  const saveAvatar = async () => {
    if (!file || !user) return;

    try {
      setSaving(true);

      const path = `${user.id}/avatar.png`;

      // ① storage に上書き
      await supabase.storage
        .from("avatars")
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
        });

      // ② 公開URL取得
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      // ③ profiles に保存
      await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);

      // ④ 画面即反映
      setProfile((prev) => ({
        ...prev,
        avatar_url: data.publicUrl,
      }));

    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <main className="min-h-screen flex justify-center pt-24">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          プロフィール
        </h1>

        {/* アバター */}
        <img
          src={profile.avatar_url || "/avatar.png"}
          alt="avatar"
          className="w-32 h-32 rounded-full mx-auto mb-6 border"
        />

        {/* ファイル選択 */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-4 w-full"
        />

        {/* 保存ボタン */}
        <button
          onClick={saveAvatar}
          disabled={saving || !file}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {saving ? "保存中…" : "保存"}
        </button>
      </div>
    </main>
  );
}
