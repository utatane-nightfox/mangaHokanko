"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function FavoritesPage() {
  const supabase = supabaseBrowser();
  const [list, setList] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("mangahokanko")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("favorite", true);

      setList(data ?? []);
    };
    load();
  }, []);

  return (
    <div className="p-6">
      {list.map(m => (
        <div key={m.id}>{m.title} {m.episode}話</div>
      ))}
    </div>
  );
}
