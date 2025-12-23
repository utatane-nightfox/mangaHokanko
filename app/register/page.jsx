"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState("");

  const submit = async () => {
    const { data: auth } = await supabase.auth.getSession();
    if (!auth.session) return;

    await supabase.from("mangas").insert({
      user_id: auth.session.user.id,
      title,
      chapters: Number(chapters),
    });

    // カウント更新
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_registered,total_chapters")
      .eq("id", auth.session.user.id)
      .single();

    await supabase.from("profiles").update({
      total_registered: (profile.total_registered || 0) + 1,
      total_chapters: (profile.total_chapters || 0) + Number(chapters),
    }).eq("id", auth.session.user.id);

    router.push("/");
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-md mx-auto">
        <input
          placeholder="タイトル"
          className="border p-2 w-full mb-2"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="話数"
          type="number"
          className="border p-2 w-full mb-4"
          onChange={(e) => setChapters(e.target.value)}
        />
        <button onClick={submit} className="bg-blue-500 text-white px-4 py-2 rounded">
          登録
        </button>
      </div>
    </>
  );
}
