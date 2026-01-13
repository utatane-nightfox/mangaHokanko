"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../utils/supabase/client";

export default function ListPage() {
  const supabase = supabaseBrowser(); // ← ★必須
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("mangahokanko")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setList(data ?? []);
      setLoading(false);
    };

    load();
  }, [supabase]); // ← OK

  if (loading) return <div className="p-6">読み込み中...</div>;

  return (
    <div className="p-6 space-y-2">
      {list.map((m) => (
        <div key={m.id}>
          {m.title}（{m.episode}話）
        </div>
      ))}
    </div>
  );
}
