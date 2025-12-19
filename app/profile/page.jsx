"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/login");

      const { data } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", session.user.id)
        .maybeSingle();

      if (data) setNickname(data.nickname ?? "");
    };
    load();
  }, []);

  const save = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from("profiles")
      .update({ nickname })
      .eq("id", session.user.id);
    router.push("/");
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white">
      <input className="border p-2 w-full" value={nickname} onChange={e=>setNickname(e.target.value)} />
      <button onClick={save} className="mt-3 bg-blue-500 text-white w-full py-2">保存</button>
    </div>
  );
}
