"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

const TITLE_DEFINITIONS = [
  { label: "見習い読書家", chapters: 100 },
  { label: "一般読書家", chapters: 1000 },
  { label: "中堅読書家", chapters: 5000 },
  { label: "プロ読書家", chapters: 10000 },
  { label: "漫画王", chapters: 100000, registered: 1000 },
];

export default function TitlesManager() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

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

  const earned = TITLE_DEFINITIONS.filter(t => {
    if (t.chapters && profile.total_chapters < t.chapters) return false;
    if (t.registered && profile.total_registered < t.registered) return false;
    return true;
  });

  const apply = async (label) => {
    await supabase
      .from("profiles")
      .update({ current_title: label })
      .eq("id", profile.id);

    setProfile({ ...profile, current_title: label });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-3">称号</h3>
      <div className="grid gap-2">
        {earned.map(t => (
          <button
            key={t.label}
            onClick={() => apply(t.label)}
            className={`p-3 rounded border
              ${profile.current_title === t.label ? "border-blue-500" : ""}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
