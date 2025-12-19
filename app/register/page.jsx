"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const [input, setInput] = useState("");

  const submit = async () => {
    const tokens = input.split(/\s+/);
    for (let i = 0; i < tokens.length; i += 2) {
      if (!/^[0-9]+$/.test(tokens[i + 1])) continue;

      await supabase.from("mangas").insert({
        title: tokens[i],
        chapters: Number(tokens[i + 1]),
      });
    }
    setInput("");
    alert("登録完了");
  };

  return (
    <main className="p-6">
      <div className="bg-white p-6 rounded shadow">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border p-2"
          placeholder="ワンピース 64 青の祓魔師 24"
        />
        <button onClick={submit} className="mt-4 bg-teal-400 text-white px-4 py-2 rounded">
          登録
        </button>
      </div>
    </main>
  );
}
