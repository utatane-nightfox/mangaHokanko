"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { TITLE_DEFINITIONS, ICON_FRAMES } from "@/components/definitions";

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

    const path = `${user.id}/avatar.png`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", user.id);

    setProfile({ ...profile, avatar_url: data.publicUrl });
    setSaving(false);
  };

  const changeFrame = async (frame) => {
    await supabase.from("profiles").update({ icon_frame: frame }).eq("id", profile.id);
    setProfile({ ...profile, icon_frame: frame });
  };

  const changeTitle = async (title) => {
    await supabase.from("profiles").update({ current_title: title }).eq("id", profile.id);
    setProfile({ ...profile, current_title: title });
  };

  if (!profile) return null;

  return (
    <main className="min-h-screen flex justify-center pt-24">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow space-y-8">
        <h1 className="text-2xl font-bold">プロフィール</h1>

        {/* アバター */}
        <div className="text-center">
          <div className={`inline-block avatar-wrapper ${profile.icon_frame}`}>
            <img
              src={profile.avatar_url || "/avatar.png"}
              className="avatar-img"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-4"
          />

          <button
            onClick={saveAvatar}
            disabled={saving}
            className="mt-2 w-full bg-green-500 text-white py-2 rounded"
          >
            {saving ? "保存中…" : "アイコン保存"}
          </button>
        </div>

        {/* フレーム */}
        <section>
          <h2 className="font-bold mb-2">アイコンフレーム</h2>
          <div className="grid grid-cols-5 gap-3">
            {ICON_FRAMES.map((f) => (
              <button
                key={f.key}
                onClick={() => changeFrame(f.class)}
                className={`p-3 rounded border ${
                  profile.icon_frame === f.class ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${f.class}`} />
              </button>
            ))}
          </div>
        </section>

        {/* 称号 */}
        <section>
          <h2 className="font-bold mb-2">称号</h2>
          <div className="grid gap-2">
            {TITLE_DEFINITIONS.map((t) => {
              const unlocked = profile.title_unlocked?.includes(t.label);
              return (
                <button
                  key={t.label}
                  disabled={!unlocked}
                  title={t.condition}
                  onClick={() => changeTitle(t.label)}
                  className={`p-3 rounded border ${
                    unlocked ? "bg-white" : "opacity-40 bg-gray-100"
                  } ${
                    profile.current_title === t.label
                      ? "border-indigo-500"
                      : "border-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
