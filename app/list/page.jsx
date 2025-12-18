"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function ListPage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data, error } = await supabase
        .from("mangahokanko")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setList(data ?? []);
    };

    load();
  }, [supabase]);

  return (
    <div>
      {list.map((m) => (
        <div key={m.id}>
          {m.title}（{m.episode}話）
        </div>
      ))}
    </div>
  );
}
