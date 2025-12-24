"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState(null);
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("total_chapters, total_registered")
        .eq("id", auth.user.id)
        .single();

      const { data: m } = await supabase
        .from("mangas")
        .select("*")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });

      setProfile(p);
      setMangas(m || []);
    };

    load();
  }, []);

  if (!profile) {
    return <div className="text-center mt-20">ログインしてください</div>;
  }

  return (
    <div className="space-y-8">
      {/* サマリー */}
      <div className="flex gap-6">
        <div className="bg-white rounded-2xl p-6 shadow">
          総話数<br />
          <b className="text-2xl">{profile.total_chapters}</b>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          登録作品数<br />
          <b className="text-2xl">{profile.total_registered}</b>
        </div>
      </div>

      {/* 一覧 */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-sky-100">
            <tr>
              <th className="p-3 text-left">タイトル</th>
              <th className="p-3 text-right">話数</th>
            </tr>
          </thead>
          <tbody>
            {mangas.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.title}</td>
                <td className="p-3 text-right">{m.chapters}</td>
              </tr>
            ))}
            {mangas.length === 0 && (
              <tr>
                <td colSpan="2" className="p-6 text-center text-gray-400">
                  まだ登録されていません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
