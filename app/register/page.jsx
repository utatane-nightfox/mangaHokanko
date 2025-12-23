"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title || !chapters) return;

    setSaving(true);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    await supabase.from("mangas").insert({
      user_id: auth.user.id,
      title,
      chapters: Number(chapters),
      favorite: false,
    });

    // プロフィール集計更新
    await supabase.rpc("update_profile_totals", {
      uid: auth.user.id,
    });

    setSaving(false);
    router.push("/");
  };

  return (
    <main className="min-h-screen flex justify-center pt-24">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow space-y-6">
        <h1 className="text-2xl font-bold text-center">
          📚 漫画登録
        </h1>

        <input
          className="w-full border p-3 rounded"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-3 rounded"
          placeholder="話数"
          value={chapters}
          onChange={(e) => setChapters(e.target.value)}
        />

        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-sky-500 text-white py-3 rounded-full font-bold btn-ani"
        >
          {saving ? "登録中…" : "登録する"}
        </button>
      </div>
    </main>
  );
}
