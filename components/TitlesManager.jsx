"use client";
import { useEffect, useState } from "react";
import { createServerSupabase } from "../utils/supabase/client";
import { TITLE_DEFINITIONS } from "./definitions";

export default function TitlesManager() {
    const [profile, setProfile] = useState(null);
  const [newTitle, setNewTitle] = useState(null);

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

      TITLE_DEFINITIONS.forEach(async t => {
        if (
          t.condition(p) &&
          !p.title_unlocked?.includes(t.label)
        ) {
          const updated = [...(p.title_unlocked || []), t.label];
          await supabase
            .from("profiles")
            .update({ title_unlocked: updated })
            .eq("id", p.id);

          setNewTitle(t.label);
        }
      });
    };
    load();
  }, []);

  if (!profile) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">称号</h2>

      <div className="grid grid-cols-2 gap-3">
        {TITLE_DEFINITIONS.map(t => {
          const owned = profile.title_unlocked?.includes(t.label);
          return (
            <button
              key={t.label}
              disabled={!owned}
              onClick={() =>
                supabase
                  .from("profiles")
                  .update({ current_title: t.label })
                  .eq("id", profile.id)
              }
              className={`p-3 rounded border ${
                owned ? "bg-white" : "bg-gray-200 opacity-40"
              }`}
              title="条件を満たすと解放"
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {newTitle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center text-white text-2xl z-50">
          <div className="text-center">
            🎉🎉🎉<br />
            新しい称号を取得しました！<br />
            {newTitle}
          </div>
        </div>
      )}
    </div>
  );
}
