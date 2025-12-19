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

  // プロフィール取得
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
        return;
      }

      const uid = data.session.user.id;
      setUserId(uid);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      if (!profile) return;

      setNickname(profile.nickname ?? "");
      setIconFrame(profile.icon_frame ?? "none");
      setCurrentTitle(profile.current_title ?? "");
      setProfileImage(profile.avatar_url ?? null);

      const titles = [];
      const ch = profile.total_chapters ?? 0;
      const rg = profile.total_registered ?? 0;

      if (ch >= 100) titles.push("見習い読書家");
      if (ch >= 1000) titles.push("一般読書家");
      if (ch >= 5000) titles.push("中堅読書家");
      if (ch >= 10000) titles.push("プロ読書家");

      if (rg >= 10) titles.push("放浪研究家");
      if (rg >= 100) titles.push("図書館所属研究家");

      setAvailableTitles(titles);
    };

    load();
  }, [supabase, router]);

  // 画像アップロード
  const handleImageUpload = async (e) => {
    if (!userId) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const path = `${userId}/${Date.now()}-${file.name}`;
      await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);

      setProfileImage(data.publicUrl);
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", userId);
    } finally {
      setUploading(false);
    }
  };

  // 保存
  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from("profiles")
      .update({
        nickname,
        icon_frame: iconFrame,
        current_title: currentTitle,
      })
      .eq("id", userId);

    setSaving(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">プロフィール編集</h1>

        <div className="text-center mb-4">
          <div className={`w-24 h-24 mx-auto rounded-full border-4 ${iconFrame}`}>
            {profileImage ? (
              <img src={profileImage} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-3xl">👤</div>
            )}
          </div>
          <input type="file" onChange={handleImageUpload} />
        </div>

        <input
          className="border p-2 w-full mb-3"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="ニックネーム"
        />

        <select
          className="border p-2 w-full mb-3"
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
        >
          <option value="">称号なし</option>
          {availableTitles.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          保存
        </button>
      </div>
    </div>
  );
}
