"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../utils/supabase/client";

export default function ListPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase
        .from("mangas") // ← 統一
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setList(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="p-6">読み込み中...</div>;

  return (
    <div className="p-6 space-y-2">
      {list.map((m) => (
        <div key={m.id}>
          {m.title}（{m.chapters}話）
        </div>
      ))}
    </div>
  );
}
