// app/register/page.jsx
"use client";
import { useState } from "react";
import { supabase } from "@/supabaseClient";


export default function RegisterPage() {
  const [title, setTitle] = useState("");
  const [episode, setEpisode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !episode) {
      alert("タイトルと話数を入力してください");
      return;
    }
    const parsed = parseInt(episode, 10);
    if (isNaN(parsed)) {
      alert("話数は半角数字で入力してください");
      return;
    }

    const { error } = await supabase.from("mangaHokanko").insert([
      {
        title: title.trim(),
        episode: parsed,
        favorite: false,
      },
    ]);

    if (error) {
      console.error(error);
      alert("登録に失敗しました");
    } else {
      alert("登録しました");
      setTitle("");
      setEpisode("");
      // optional: navigate back to main by location
      // location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg border">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">漫画を登録</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">タイトル</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="ワンピース"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">話数（半角数字）</label>
            <input
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              type="number"
              className="w-full p-3 border rounded-lg"
              placeholder="64"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-green-500 text-white btn-ani">
            登録する
          </button>
        </form>
      </div>
    </div>
  );
}
