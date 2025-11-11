"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { getAvailableTitles } from "@/app/lib/getTitle";
import "@/app/lib/frameStyles.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProfilePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [iconFrame, setIconFrame] = useState("frame1");
  const [title, setTitle] = useState("");
  const [availableTitles, setAvailableTitles] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [saving, setSaving] = useState(false);

  // 🔹 枠リスト
  const frames = Array.from({ length: 20 }, (_, i) => ({
    id: `frame${i + 1}`,
    label: `枠 ${i + 1}`,
  }));

  // 🔹 プロフィール読み込み & 自動更新サブスクライブ
  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
        return;
      }

      const user = data.session.user;
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname, icon_frame, title, total_chapters, total_registered, profile_image_url")
        .eq("id", user.id)
        .single();

      if (profile) {
        setNickname(profile.nickname || "");
        setIconFrame(profile.icon_frame || "frame1");
        setTitle(profile.title || "");
        setProfileImage(profile.profile_image_url || null);

        // 🔹 称号リスト更新
        setAvailableTitles(getAvailableTitles(profile.total_chapters, profile.total_registered));
      }
    };

    loadProfile();

    // 🔹 リアルタイム更新（自動反映）
    const channel = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          const updated = payload.new;
          if (updated.id === userId) {
            setNickname(updated.nickname);
            setIconFrame(updated.icon_frame);
            setTitle(updated.title);
            setProfileImage(updated.profile_image_url);
            setAvailableTitles(
              getAvailableTitles(updated.total_chapters, updated.total_registered)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, userId]);

  // 🔹 プロフィール画像アップロード
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      alert("画像アップロードに失敗しました。");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const imageUrl = data.publicUrl;

    await supabase.from("profiles").update({ profile_image_url: imageUrl }).eq("id", userId);
    setProfileImage(imageUrl);
  };

  // 🔹 保存
  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        nickname,
        icon_frame: iconFrame,
        title,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      alert("保存に失敗しました。");
    } else {
      alert("プロフィールを更新しました！");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">プロフィール編集</h1>

        {/* 🖼 プロフィール画像 */}
        <div className="relative inline-block mb-4">
          <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center text-4xl ${iconFrame}`}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              "👤"
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 text-sm"
          />
        </div>

        {/* 🏷 ニックネーム */}
        <div className="mb-4">
          <label className="block text-left text-sm mb-1">ニックネーム</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="例: 夜狐"
          />
        </div>

        {/* 🌈 枠選択 */}
        <div className="mb-4">
          <label className="block text-left text-sm mb-1">アイコン枠</label>
          <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto">
            {frames.map((f) => (
              <button
                key={f.id}
                onClick={() => setIconFrame(f.id)}
                className={`p-2 rounded border ${
                  iconFrame === f.id ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 mx-auto flex items-center justify-center text-lg ${f.id}`}>
                  👤
                </div>
                <p className="text-xs mt-1">{f.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 🏅 称号選択 */}
        <div className="mb-6">
          <label className="block text-left text-sm mb-1">称号</label>
          {availableTitles.length > 0 ? (
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="">称号なし</option>
              {availableTitles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500 text-sm">まだ称号は獲得していません。</p>
          )}
        </div>

        {/* 💾 保存ボタン */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存する"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="block mt-4 text-gray-500 hover:underline text-sm"
        >
          ← メイン画面に戻る
        </button>
      </div>
    </div>
  );
}
