"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

/* =========================
   称号定義（省略なし）
========================= */
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

  {
    label: "漫画王",
    type: "both",
    threshold: { chapters: 100000, registered: 1000 },
  },
];

export default function TitlesManager() {
  const supabase = supabaseBrowser();

  const [profile, setProfile] = useState(null);
  const [earnedTitles, setEarnedTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     初期ロード
  ========================= */
  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("プロフィール取得失敗", error);
        setLoading(false);
        return;
      }

      setProfile(profileData);
      evaluateTitles(profileData);
      setLoading(false);
    };

    load();
  }, []);

  /* =========================
     称号判定ロジック
  ========================= */
  const evaluateTitles = (p) => {
    const chapters = p.total_chapters ?? 0;
    const registered = p.total_registered ?? 0;

    const unlocked = TITLE_DEFINITIONS.filter((t) => {
      if (t.type === "chapters") {
        return chapters >= t.threshold;
      }
      if (t.type === "registered") {
        return registered >= t.threshold;
      }
      if (t.type === "both") {
        return (
          chapters >= t.threshold.chapters &&
          registered >= t.threshold.registered
        );
      }
      return false;
    }).map((t) => t.label);

    setEarnedTitles(unlocked);
  };

  /* =========================
     称号を適用
  ========================= */
  const applyTitle = async (label) => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({ current_title: label })
      .eq("id", profile.id);

    if (error) {
      console.error("称号更新失敗", error);
      return;
    }

    setProfile({ ...profile, current_title: label });
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (!profile) {
    return <div className="p-4">プロフィールがありません</div>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">🏷 称号</h2>

      <div className="grid grid-cols-1 gap-3">
        {TITLE_DEFINITIONS.map((t) => {
          const unlocked = earnedTitles.includes(t.label);
          const active = profile.current_title === t.label;

          return (
            <button
              key={t.label}
              disabled={!unlocked}
              onClick={() => applyTitle(t.label)}
              className={`
                p-4 rounded-xl border text-left transition
                ${
                  active
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200"
                }
                ${!unlocked && "opacity-40 cursor-not-allowed"}
              `}
            >
              <div className="font-semibold">{t.label}</div>
              <div className="text-sm text-gray-500">
                {t.type === "chapters" && `総話数 ${t.threshold} 以上`}
                {t.type === "registered" && `登録数 ${t.threshold} 以上`}
                {t.type === "both" &&
                  `話数 ${t.threshold.chapters} / 登録 ${t.threshold.registered}`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
