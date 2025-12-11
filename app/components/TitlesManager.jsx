"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
const supabase = createBrowserSupabase();



const TITLE_DEFINITIONS = [
  { id: "chapters_100", label: "見習い読書家", desc: "合計話数 100", type: "chapters", threshold: 100 },
  { id: "chapters_1000", label: "一般読書家", desc: "合計話数 1,000", type: "chapters", threshold: 1000 },
  { id: "chapters_5000", label: "中堅読書家", desc: "合計話数 5,000", type: "chapters", threshold: 5000 },
  { id: "chapters_10000", label: "プロ読書家", desc: "合計話数 10,000", type: "chapters", threshold: 10000 },
  { id: "chapters_100000", label: "伝導者", desc: "合計話数 100,000", type: "chapters", threshold: 100000 },

  { id: "registered_10", label: "放浪研究家", desc: "合計登録数 10", type: "registered", threshold: 10 },
  { id: "registered_100", label: "図書館所属研究家", desc: "合計登録数 100", type: "registered", threshold: 100 },
  { id: "registered_500", label: "王宮所属研究家", desc: "合計登録数 500", type: "registered", threshold: 500 },
  { id: "registered_1000", label: "究明者", desc: "合計登録数 1000", type: "registered", threshold: 1000 },

  { id: "manga_king", label: "漫画王", desc: "合計話数 100000 ＆ 合計登録数 1000", type: "both", threshold: { chapters: 100000, registered: 1000 } },
];

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed right-6 top-6 z-50 pointer-events-auto">
      <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeInUp">
        {message}
      </div>
    </div>
  );
}

export default function TitlesManager() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [earned, setEarned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [setting, setSetting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(data.user);
      await loadProfile(data.user.id);
      setLoading(false);
    };
    init();

    const sub = supabase
      .channel("public:profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          if (payload.record && user && payload.record.id === user.id) {
            setProfile(payload.record);
            evaluateEarned(payload.record);
          }
        }
      )
      .subscribe();

    return () => {
      try { supabase.removeChannel(sub); } catch (e) {}
    };
  }, []);

  const loadProfile = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, nickname, avatar_url, icon_frame, total_chapters, total_registered, current_title")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("profile load error:", error);
      setProfile(null);
    } else {
      setProfile(data);
      evaluateEarned(data);
    }
    setLoading(false);
  };

  const evaluateEarned = (p) => {
    if (!p) return setEarned([]);

    const chapters = Number(p.total_chapters || 0);
    const registered = Number(p.total_registered || 0);

    const earnedIds = TITLE_DEFINITIONS.filter((t) => {
      if (t.type === "chapters") return chapters >= t.threshold;
      if (t.type === "registered") return registered >= t.threshold;
      if (t.type === "both")
        return chapters >= t.threshold.chapters && registered >= t.threshold.registered;
      return false;
    }).map((t) => t.id);

    setEarned(earnedIds);
  };

  const applyTitle = async (titleId) => {
    if (!user || !profile) return;
    if (!earned.includes(titleId)) return;

    setSetting(true);

    const { error } = await supabase
      .from("profiles")
      .update({ current_title: titleId })
      .eq("id", profile.id);

    setSetting(false);

    if (error) {
      console.error("failed to set current_title:", error);
      setToast("称号の設定に失敗しました");
    } else {
      setToast("称号を変更しました！");
      setProfile({ ...profile, current_title: titleId });
    }
  };

  if (loading) return <div className="p-4">読み込み中…</div>;
  if (!user) return <div className="p-4 text-red-500">ログインしてください</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">称号（Titles）</h3>

      <div className="mb-4 text-sm text-gray-600">
        あなたの合計話数: <strong>{profile?.total_chapters ?? 0}</strong> /
        合計登録数: <strong>{profile?.total_registered ?? 0}</strong>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TITLE_DEFINITIONS.map((t) => {
          const isEarned = earned.includes(t.id);
          const isActive = profile?.current_title === t.id;
          return (
            <button
              key={t.id}
              onClick={() => isEarned && applyTitle(t.id)}
              disabled={!isEarned || setting}
              className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition ${
                isEarned
                  ? "bg-white hover:scale-105"
                  : "bg-gray-50 opacity-60 cursor-not-allowed"
              } ${isActive ? "border-indigo-500 shadow-md" : "border-gray-200"}`}
              title={t.desc + (isEarned ? " — クリックで設定" : " — 条件未達成")}
            >
              <div>
                <div className="font-medium">{t.label}</div>
                <div className="text-sm text-gray-500">{t.desc}</div>
              </div>

              <div className="text-right">
                {isActive ? (
                  <div className="text-indigo-600 font-semibold">選択中</div>
                ) : isEarned ? (
                  <div className="text-sm text-gray-400">獲得済み</div>
                ) : (
                  <div className="text-sm text-gray-300">未獲得</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <style jsx>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.45s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
