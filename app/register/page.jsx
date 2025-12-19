"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const [input, setInput] = useState("");

  const submit = async () => {
    const parts = input.split(/\s+/);
    for (let i = 0; i < parts.length; i += 2) {
      if (!/^\d+$/.test(parts[i + 1])) continue;

      await supabase.from("manga_logs").insert({
        title: parts[i],
        chapters: Number(parts[i + 1]),
        favorite: false,
      });
    }
    setInput("");
    alert("登録完了");
  };

  return (
    <main className="p-6">
      <textarea
        className="border w-full h-40 p-2"
        placeholder="例）ワンピース 64 青の祓魔師 24"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={submit}
        className="mt-4 bg-sky-400 text-white px-4 py-2 rounded"
      >
        登録
      </button>
    </main>
  );
}
