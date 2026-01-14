"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../utils/supabase/client";

export default function StoragePage() {
  const supabase = supabaseBrowser();
  const [storages, setStorages] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const { data: s } = await supabase
        .from("storages")
        .select("*")
        .eq("user_id", data.user.id);
      setStorages(s || []);
    });
  }, []);

  const add = async () => {
    const { data: u } = await supabase.auth.getUser();
    await supabase.from("storages").insert({
      name,
      user_id: u.user.id,
    });
    location.reload();
  };

  return (
    <main className="pt-24 max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl p-6 shadow">
        <h1 className="text-xl font-bold mb-4">保管庫</h1>
        <div className="flex gap-2 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
            placeholder="フォルダ名"
          />
          <button onClick={add} className="bg-emerald-400 text-white px-4 rounded">
            追加
          </button>
        </div>
        <ul className="space-y-2">
          {storages.map((s) => (
            <li key={s.id} className="p-3 bg-sky-50 rounded">
              {s.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
