"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState("");

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("mangas").insert({
      user_id: user.id,
      title,
      chapters: Number(chapters),
    });

    setTitle("");
    setChapters("");
  };

  return (
    <main className="p-10 max-w-xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow space-y-4">
        <h1 className="text-xl font-bold">作品登録</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="話数"
          type="number"
          value={chapters}
          onChange={(e) => setChapters(e.target.value)}
        />

        <button
          onClick={save}
          className="w-full bg-sky-500 text-white py-2 rounded"
        >
          登録
        </button>
      </div>
    </main>
  );
}
