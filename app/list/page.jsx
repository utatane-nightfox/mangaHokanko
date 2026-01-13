"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../utils/supabase/client";

export default function ListPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 未ログインはログインへ
      if (!session) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("mangahokanko")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setList(data ?? []);
      }

      setLoading(false);
    };

    load();
  }, [router, supabase]);

  if (loading) {
    return <div className="p-6">読み込み中...</div>;
  }

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
