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

  // ========================
  // プロフィール取得
  // ========================
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
        console.error("profile load error:", error);
        alert("プロフィール取得に失敗しました");
        return;
      }

      setNickname(profile.nickname ?? "");
      setIconFrame(profile.icon_frame ?? "none");
      setCurrentTitle(profile.current_title ?? null);
      setProfileImage(profile.avatar_url ?? null);

      // 称号判定
      const titles = [];
      const ch = profile.total_chapters ?? 0;
      const rg = profile.total_registered ?? 0;

      if (ch >= 100) titles.push("見習い読書家");
      if (ch >= 1000) titles.push("一般読書家");
      if (ch >= 5000) titles.push("中堅読書家");
      if (ch >= 10000) titles.push("プロ読書家");
      if (ch >= 100000) titles.push("伝導者");

      if (rg >= 10) titles.push("放浪研究家");
      if (rg >= 100) titles.push("図書館所属研究家");
      if (rg >= 500) titles.push("王宮所属研究家");
      if (rg >= 1000) titles.push("究明者");

      if (ch >= 100000 && rg >= 1000) titles.push("漫画王");

      setAvailableTitles(titles);
    };

    loadProfile();
  }, [router, supabase]);

  // ========================
  // 画像アップロード
  // ========================
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

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", userId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error(err);
      alert("画像保存に失敗しました");
    } finally {
      setUploading(false);
    }
  };

  // ========================
  // 保存
  // ========================
  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        nickname,
        icon_frame: iconFrame,
        current_title: currentTitle,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      console.error("save error:", error);
      alert("保存に失敗しました");
    } else {
      alert("プロフィールを保存しました");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">プロフィール編集</h1>

        <div className="text-center mb-4">
          <div className={`w-24 h-24 mx-auto rounded-full border-4 ${iconFrame}`}>
            {profileImage ? (
              <img
                src={profileImage}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-3xl">
                👤
              </div>
            )}
          </div>

          <input type="file" onChange={handleImageUpload} />
          {uploading && (
            <p className="text-sm text-gray-500">アップロード中…</p>
          )}
        </div>

        <input
          className="border p-2 w-full mb-3"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="ニックネーム"
        />

        <select
          className="border p-2 w-full mb-3"
          value={currentTitle ?? ""}
          onChange={(e) => setCurrentTitle(e.target.value || null)}
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
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
      </div>
    </div>
  );
}
