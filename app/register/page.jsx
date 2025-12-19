"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState("");

  const handleSubmit = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    await supabase.from("manga_logs").insert({
      user_id: session.user.id,
      title,
      chapters: Number(chapters),
    });

    alert("登録しました");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 to-sky-100 p-6">
      <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">📖 登録</h1>

        <input
          className="border p-2 w-full mb-3"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="話数（半角）"
          value={chapters}
          onChange={(e) => setChapters(e.target.value.replace(/[^0-9]/g, ""))}
        />

        <button
          onClick={handleSubmit}
          className="bg-green-400 text-white w-full py-2 rounded"
        >
          登録
        </button>
      </div>
    </main>
  );
}
