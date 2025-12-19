"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

const supabase = supabaseBrowser();

const TITLE_DEFINITIONS = [
  { label: "見習い読書家", type: "chapters", threshold: 100 },
  { label: "一般読書家", type: "chapters", threshold: 1000 },
  { label: "中堅読書家", type: "chapters", threshold: 5000 },
  { label: "プロ読書家", type: "chapters", threshold: 10000 },
  { label: "伝導者", type: "chapters", threshold: 100000 },
  { label: "放浪研究家", type: "registered", threshold: 10 },
  { label: "図書館所属研究家", type: "registered", threshold: 100 },
  { label: "王宮所属研究家", type: "registered", threshold: 500 },
  { label: "究明者", type: "registered", threshold: 1000 },
  { label: "漫画王", type: "both", threshold: { chapters: 100000, registered: 1000 } },
];

export default function TitleManager() {
  const [profile, setProfile] = useState(null);
  const [earned, setEarned] = useState([]);

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
      evaluate(p);
    };
    load();
  }, []);

  const evaluate = (p) => {
    const ch = p.total_chapters || 0;
    const rg = p.total_registered || 0;

    const list = TITLE_DEFINITIONS.filter(t => {
      if (t.type === "chapters") return ch >= t.threshold;
      if (t.type === "registered") return rg >= t.threshold;
      if (t.type === "both") return ch >= t.threshold.chapters && rg >= t.threshold.registered;
    }).map(t => t.label);

    setEarned(list);
  };

  const apply = async (label) => {
    await supabase
      .from("profiles")
      .update({ current_title: label })
      .eq("id", profile.id);

    setProfile({ ...profile, current_title: label });
  };

  if (!profile) return null;

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="font-bold mb-3">称号</h3>
      <div className="grid gap-2">
        {TITLE_DEFINITIONS.map(t => {
          const ok = earned.includes(t.label);
          const active = profile.current_title === t.label;
          return (
            <button
              key={t.label}
              disabled={!ok}
              onClick={() => apply(t.label)}
              className={`p-3 rounded border ${active ? "border-indigo-500" : ""} ${!ok && "opacity-50"}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
