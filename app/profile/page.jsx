"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import "@/lib/frameStyles.css";

export default function ProfilePage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [nickname, setNickname] = useState("");
  const [iconFrame, setIconFrame] = useState("none");
  const [currentTitle, setCurrentTitle] = useState("");
  const [availableTitles, setAvailableTitles] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const frames = [
    { id: "none", label: "枠なし" },
    { id: "frame1", label: "ピンク丸" },
    { id: "frame2", label: "グリーン丸" },
    { id: "frame3", label: "ネオン" },
  ];

  // =========================
  // プロフィール読み込み
  // =========================
  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.push("/login");
        return;
      }

      const user = data.session.user;
      setUserId(user.id);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          "nickname, icon_frame, current_title, total_chapters, total_registered, avatar_url"
        )
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        alert("プロフィール取得失敗");
        return;
      }

      setNickname(profile.nickname || "");
      setIconFrame(profile.icon_frame || "none");
      setCurrentTitle(profile.current_title || "");
      setProfileImage(profile.avatar_url || null);

      // 称号計算（最低限）
      const titles = [];
      const ch = profile.total_chapters || 0;
      const rg = profile.total_registered || 0;

      if (ch >= 100) titles.push("見習い読書家");
      if (ch >= 1000) titles.push("一般読書家");
      if (rg >= 10) titles.push("放浪研究家");

      setAvailableTitles(titles);
    };

    loadProfile();
  }, [router, supabase]);

  // =========================
  // 画像アップロード
  // =========================
  const handleImageUpload = async (e) => {
    if (!userId) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const filePath = `${userId}/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const url = data.publicUrl;
      setProfileImage(url);

      await supabase.from("profiles").update({
        avatar_url: url,
      }).eq("id", userId);

    } catch (err) {
      console.error(err);
      alert("画像保存失敗");
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // 保存
  // =========================
  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        nickname,
        icon_frame: iconFrame,
        current_title: currentTitle || null,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("保存失敗");
    } else {
      alert("プロフィールを更新しました");
      router.push("/");
    }
  };

  // =========================
  // 表示
  // =========================
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">プロフィール編集</h1>

        {/* アイコン */}
        <div className="text-center mb-4">
          <div
            className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center text-3xl ${iconFrame}`}
          >
            {profileImage ? (
              <img
                src={profileImage}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              "👤"
            )}
          </div>
          <input type="file" onChange={handleImageUpload} className="mt-2 text-sm" />
          {uploading && <p className="text-xs text-gray-500">アップロード中…</p>}
        </div>

        {/* ニックネーム */}
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border p-2 w-full rounded mb-3"
          placeholder="ニックネーム"
        />

        {/* 枠 */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {frames.map((f) => (
            <button
              key={f.id}
              onClick={() => setIconFrame(f.id)}
              className={`p-2 border rounded ${
                iconFrame === f.id ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <div className={`w-8 h-8 mx-auto ${f.id}`}>👤</div>
            </button>
          ))}
        </div>

        {/* 称号 */}
        <select
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        >
          <option value="">称号なし</option>
          {availableTitles.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </div>
    </div>
  );
}
