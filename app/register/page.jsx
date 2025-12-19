"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const [title, setTitle] = useState("");
  const [episode, setEpisode] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    if (!/^\d+$/.test(episode)) {
      alert("話数は半角数字");
      return;
    }

    await supabase.from("mangahokanko").insert({
      user_id: session.user.id,
      title,
      episode: Number(episode),
      favorite: false,
    });

    setTitle("");
    setEpisode("");
  };

  return (
    <form onSubmit={submit} className="p-6 bg-white max-w-md mx-auto">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="タイトル" className="border p-2 w-full mb-2"/>
      <input value={episode} onChange={e=>setEpisode(e.target.value)} placeholder="話数" className="border p-2 w-full mb-2"/>
      <button className="bg-green-500 text-white w-full py-2">登録</button>
    </form>
  );
}
