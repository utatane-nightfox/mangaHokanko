"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    // ログインユーザー取得
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return alert("未ログイン");

    /* ----------------------------
       ① 漫画を登録（404の修正点）
    ---------------------------- */
    const { error: insertError } = await supabase
      .from("mangas") // ← manga_logs ではない！
      .insert({
        user_id: user.id,
        title,
        chapters: Number(chapters),
      });

    if (insertError) {
      console.error(insertError);
      alert("漫画登録に失敗");
      return;
    }

    /* ----------------------------
       ② プロフィールのカウント更新
       （RPCなし版：安全）
    ---------------------------- */
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_registered, total_chapters")
      .eq("id", user.id)
      .single();

    await supabase
      .from("profiles")
      .update({
        total_registered: (profile.total_registered || 0) + 1,
        total_chapters: (profile.total_chapters || 0) + Number(chapters),
      })
      .eq("id", user.id);

    router.push("/");
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">漫画登録</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        className="w-full border p-2"
        required
      />

      <input
        type="number"
        value={chapters}
        onChange={(e) => setChapters(e.target.value)}
        placeholder="話数"
        className="w-full border p-2"
        required
      />

      <button className="w-full bg-blue-500 text-white p-2 rounded">
        登録
      </button>
    </form>
  );
}
