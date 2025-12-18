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
  const [currentTitle, setCurrentTitle] = useState(null);
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

  // プロフィール読み込み
  useEffect(() => {
    const load = async () => {
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

      const titles = [];
      const ch = profile.total_chapters || 0;
      const rg = profile.total_registered || 0;

      if (ch >= 100) titles.push("見習い読書家");
      if (ch >= 1000) titles.push("一般読書家");
      if (rg >= 10) titles.push("放浪研究家");

      setAvailableTitles(titles);
    };

    load();
  }, [router, supabase]);

  // 画像アップロード
  const handleImageUpload = async (e) => {
    if (!userId) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const filePath = `${userId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const url = data.publicUrl;

      setProfileImage(url);

      await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", userId);
    } catch (err) {
      console.error(err);
      alert("画像保存失敗");
    } finally {
      setUploading(false);
    }
  };

  // 保存
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
      alert("保存しました");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">プロフィール編集</h1>

        {/* アイコン */}
        <div className={`w-24 h-24 mx-auto rounded-full border-4 ${iconFrame}`}>
          {profileImage ? (
            <img
              src={profileImage}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              👤
            </div>
          )}
        </div>

        <input
          type="file"
          onChange={handleImageUpload}
          className="mt-2 text-sm"
        />

        {/* ニックネーム */}
        <input
          className="border p-2 w-full mt-4 rounded"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="ニックネーム"
        />

        {/* 称号 */}
        <select
          className="border p-2 w-full mt-4 rounded"
          value={currentTitle || ""}
          onChange={(e) => setCurrentTitle(e.target.value)}
        >
          <option value="">称号なし</option>
          {availableTitles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </div>
    </div>
  );
}
