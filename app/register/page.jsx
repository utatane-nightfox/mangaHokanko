"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState("");
  const [loading, setLoading] = useState(false);

  // ログイン確認
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
    });
  }, []);

  const submit = async () => {
    if (!title || !chapters) {
      alert("タイトルと話数を入力してください");
      return;
    }

    setLoading(true);

    /* =========================
       ① mangas に登録
    ========================= */
    const { error: insertError } = await supabase
      .from("mangas")
      .insert({
        user_id: user.id,
        title,
        chapters: Number(chapters),
      });

    if (insertError) {
      console.error(insertError);
      alert("漫画登録に失敗しました");
      setLoading(false);
      return;
    }

    /* =========================
       ② profiles のカウント更新
       （RPCなし・安全版）
    ========================= */
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

    setTitle("");
    setChapters("");
    setLoading(false);

    router.push("/");
  };

  return (
    <main className="min-h-screen flex justify-center items-start pt-24">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">📘 漫画登録</h1>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-4 rounded"
          type="number"
          placeholder="話数"
          value={chapters}
          onChange={(e) => setChapters(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "登録中…" : "登録"}
        </button>
      </div>
    </main>
  );
}
