import { supabaseBrowser } from "@/utils/supabase/client";

export async function updateProfileStats(userId: string) {
  const supabase = supabaseBrowser();

  const { data } = await supabase
    .from("mangaHokanko")
    .select("episode");

  const total_registered = data.length;
  const total_chapters = data.reduce((sum, m) => sum + (m.episode || 0), 0);

  await supabase
    .from("profiles")
    .update({ total_registered, total_chapters })
    .eq("id", userId);
}
