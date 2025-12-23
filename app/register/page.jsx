"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState("");

  const submit = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session.user;

    await supabase.from("mangas").insert({
      user_id: user.id,
      title,
      chapters: Number(chapters),
    });

    // カウント更新
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_registered, total_chapters")
      .eq("id", user.id)
      .single();

    await supabase
      .from("profiles")
      .update({
        total_registered: (profile.total_registered ?? 0) + 1,
        total_chapters: (profile.total_chapters ?? 0) + Number(chapters),
      })
      .eq("id", user.id);

    router.push("/");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">漫画登録</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        className="border p-2 w-full mb-3"
      />

      <input
        value={chapters}
        onChange={(e) => setChapters(e.target.value)}
        placeholder="話数"
        type="number"
        className="border p-2 w-full mb-3"
      />

      <button
        onClick={submit}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        登録
      </button>
    </div>
  );
}
