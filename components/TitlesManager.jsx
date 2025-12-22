"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

const TITLES = [
  { label: "見習い読書家", chapters: 100 },
  { label: "一般読書家", chapters: 1000 },
  { label: "中堅読書家", chapters: 5000 },
  { label: "プロ読書家", chapters: 10000 },
];

export default function TitlesManager() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

      setProfile(p);
    };
    load();
  }, []);

  if (!profile) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">称号</h2>
      <div className="grid grid-cols-2 gap-4">
        {TITLES.map((t) => {
          const ok = (profile.total_chapters || 0) >= t.chapters;
          return (
            <button
              key={t.label}
              disabled={!ok}
              onClick={async () => {
                await supabase
                  .from("profiles")
                  .update({ current_title: t.label })
                  .eq("id", profile.id);
                setProfile({ ...profile, current_title: t.label });
              }}
              className={`p-4 rounded border ${
                profile.current_title === t.label
                  ? "border-indigo-500"
                  : ""
              } ${!ok && "opacity-40"}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
