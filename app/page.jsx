"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function HomePage() {
  const supabase = supabaseBrowser();

  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  // セッション監視
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      supabase.auth.onAuthStateChange((_e, s) => {
        setSession(s);
      });
    };
    init();
  }, [supabase]);

  // プロフィール取得 or 作成
  useEffect(() => {
    if (session === undefined) return;
    if (!session) {
      location.href = "/login";
      return;
    }

    const loadProfile = async () => {
      try {
        const userId = session.user.id;

        // 取得
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) throw error;

        // なければ作成
        if (!data) {
          const { data: created, error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              nickname: "",
              icon_frame: "none",
              total_chapters: 0,
              total_registered: 0,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setProfile(created);
        } else {
          setProfile(data);
        }
      } catch (e) {
        console.error(e);
        setError("プロフィール情報の取得に失敗しました");
      }
    };

    loadProfile();
  }, [session, supabase]);

  if (session === undefined) return <div>確認中…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>読み込み中…</div>;

  const {
    nickname,
    icon_frame,
    avatar_url,
    total_chapters,
    total_registered,
    current_title,
  } = profile;

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <section className="bg-white rounded-xl p-6 shadow mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full border-2 ${icon_frame}`}>
            {avatar_url ? (
              <img src={avatar_url} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">👤</div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{nickname || "名無しの読書家"}</h2>
            <p className="text-gray-500">称号：{current_title || "なし"}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 shadow grid grid-cols-2 text-center">
        <div>
          <p className="text-3xl font-bold text-blue-600">{total_chapters}</p>
          <p>合計話数</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-green-600">{total_registered}</p>
          <p>登録数</p>
        </div>
      </section>
    </main>
  );
}
