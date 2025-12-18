"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const [title, setTitle] = useState("");
  const [episode, setEpisode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("ログインしてください");
      return;
    }

    const parsedEpisode = Number(episode);
    if (!title || Number.isNaN(parsedEpisode)) {
      alert("入力エラー");
      return;
    }

    const { error } = await supabase
      .from("mangahokanko")
      .insert({
        user_id: session.user.id,
        title: title.trim(),
        episode: parsedEpisode,
        favorite: false,
      });

    if (error) {
      console.error(error);
      alert("登録失敗");
      return;
    }

    setTitle("");
    setEpisode("");
    alert("登録しました");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="話数"
        type="number"
        value={episode}
        onChange={(e) => setEpisode(e.target.value)}
      />
      <button type="submit">登録</button>
    </form>
  );
}
