"use client";

import { ICON_FRAMES } from "./iconFrames";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function IconFrameSelector({ profile, setProfile }) {
  const supabase = supabaseBrowser();

  const select = async (id) => {
    await supabase
      .from("profiles")
      .update({ icon_frame: id })
      .eq("id", profile.id);

    setProfile({ ...profile, icon_frame: id });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow mt-6">
      <h2 className="font-bold mb-3">アイコンフレーム</h2>

      <div className="grid grid-cols-4 gap-3">
        {ICON_FRAMES.map(f => (
          <button
            key={f.id}
            onClick={() => select(f.id)}
            className={`p-3 rounded border ${
              profile.icon_frame === f.id ? "border-indigo-500" : ""
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
