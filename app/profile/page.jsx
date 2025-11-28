"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import '@/lib/frameStyles.css';

export default function ProfilePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [iconFrame, setIconFrame] = useState("none");
  const [title, setTitle] = useState("");
  const [availableTitles, setAvailableTitles] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 枠一覧
  const frames = [
    { id: "none", label: "枠なし" },
    { id: "frame1", label: "ピンク丸" },
    { id: "frame2", label: "グリーン丸" },
    { id: "frame3", label: "ネオン" },
    { id: "frame4", label: "光る枠" },
    { id: "frame5", label: "スパーク" },
    { id: "frame6", label: "炎" },
    { id: "frame7", label: "氷" },
    { id: "frame8", label: "シャドウ" },
    { id: "frame9", label: "虹" },
    { id: "frame10", label: "鼓動" },
    { id: "frame11", label: "オーラ" },
    { id: "frame12", label: "ドット風" },
    { id: "frame13", label: "グリッチ" },
    { id: "frame14", label: "メタル" },
    { id: "frame15", label: "植物" },
    { id: "frame16", label: "ブラッディ" },
    { id: "frame17", label: "魔法陣" },
    { id: "frame18", label: "バブル" },
    { id: "frame19", label: "電気" },
    { id: "frame20", label: "回転" },
  ];

  // プロフィール読み込み
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
        .select("nickname, icon_frame, title, total_chapters, total_registered, profile_image_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("プロフィールの取得に失敗:", error);
        alert("プロフィールの情報取得に失敗しました。");
        return;
      }

      setNickname(profile.nickname || "");
      setIconFrame(profile.icon_frame || "none");
      setTitle(profile.title || "");
      setProfileImage(profile.profile_image_url || null);

      // 獲得称号
      const titles = [];
      const ch = profile.total_chapters || 0;
      const rg = profile.total_registered || 0;

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
  }, [router]);

  // 画像アップロード
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadErr } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const imageUrl = data?.publicUrl;
      if (!imageUrl) throw new Error("公開URL取得失敗");

      setProfileImage(imageUrl);

      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ profile_image_url: imageUrl })
        .eq("id", userId);

      if (dbErr) throw dbErr;
    } catch (err) {
      console.error("handleImageUpload err:", err);
      alert("画像の保存に失敗しました。アップロードは完了しています。");
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
        title,
      })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      console.error("save err:", error);
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

        {/* プロフィール画像 */}
        <div className="relative inline-block mb-4">
          <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center text-4xl ${iconFrame}`}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              "👤"
            )}
          </div>
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
            {uploading && <div className="text-xs text-gray-500 mt-1">アップロード中…</div>}
          </div>
        </div>

        {/* ニックネーム */}
        <div className="mb-4 text-left">
          <label className="block text-sm mb-1">ニックネーム</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="例: 夜狐"
          />
        </div>

        {/* 枠選択 */}
        <div className="mb-4 text-left">
          <label className="block text-sm mb-1">アイコン枠</label>
          <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto">
            {frames.map((f) => (
              <button
                key={f.id}
                onClick={() => setIconFrame(f.id)}
                className={`p-2 rounded border ${iconFrame === f.id ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
              >
                <div className={`w-10 h-10 mx-auto flex items-center justify-center text-lg ${f.id}`}>👤</div>
                <p className="text-xs mt-1">{f.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 称号 */}
        <div className="mb-6 text-left">
          <label className="block text-sm mb-1">称号</label>
          {availableTitles.length > 0 ? (
            <select value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full rounded">
              <option value="">称号なし</option>
              {availableTitles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500 text-sm">まだ称号は獲得していません。</p>
          )}
        </div>

        {/* 保存ボタン */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存する"}
          </button>
          <button onClick={() => router.push("/")} className="block mt-2 text-gray-500 hover:underline text-sm">
            ← メイン画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
