"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function ListPage() {
  const supabase = supabaseBrowser();
  const [mangaList, setMangaList] = useState([]);
  const [sortType, setSortType] = useState("created_at");

  const fetchData = async () => {
    const { data } = await supabase
      .from("mangaHokanko")
      .select("*")
      .order(sortType, { ascending: sortType === "title" });

    setMangaList(data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, [sortType]);

  return (
    <div>
      <h1>一覧</h1>
      {mangaList.map((m) => (
        <div key={m.id}>{m.title}</div>
      ))}
    </div>
  );
}
