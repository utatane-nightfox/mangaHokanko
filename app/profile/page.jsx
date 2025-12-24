"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ICON_FRAMES, TITLE_DEFINITIONS } from "@/components/definitions";

export default function ProfilePage() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

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
    if (!file) return;
    const path = `${profile.id}/avatar.png`;

    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", profile.id);

    setProfile({ ...profile, avatar_url: data.publicUrl });
  };

  const changeFrame = async (frame) => {
    await supabase
      .from("profiles")
      .update({ icon_frame: frame })
      .eq("id", profile.id);
    setProfile({ ...profile, icon_frame: frame });
  };

  if (!profile) return null;

  return (
    <main className="pt-24 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow space-y-6">
        <h1 className="text-xl font-bold">プロフィール</h1>

        <div className="text-center">
          <div className={`inline-block ${profile.icon_frame}`}>
            <img
              src={profile.avatar_url || "/avatar.png"}
              className="w-32 h-32 rounded-full"
            />
          </div>

          {profile.current_title && (
            <div className="mt-2 text-sm text-indigo-600">
              {profile.current_title}
            </div>
          )}

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-4"
          />
          <button
            onClick={saveAvatar}
            className="mt-2 w-full bg-green-500 text-white py-2 rounded"
          >
            アイコン保存
          </button>
        </div>

        <section>
          <h2 className="font-bold mb-2">アイコンフレーム</h2>
          <div className="grid grid-cols-5 gap-3">
            {ICON_FRAMES.map((f) => (
              <button
                key={f.key}
                onClick={() => changeFrame(f.class)}
                className="p-2 border rounded"
              >
                <div className={`w-10 h-10 rounded-full ${f.class}`} />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-2">称号</h2>
          <div className="space-y-2">
            {TITLE_DEFINITIONS.map((t) => {
              const unlocked = t.check(profile);
              return (
                <div
                  key={t.label}
                  className={`p-3 rounded border ${
                    unlocked ? "" : "opacity-40"
                  }`}
                  title={t.condition}
                >
                  {t.label}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
