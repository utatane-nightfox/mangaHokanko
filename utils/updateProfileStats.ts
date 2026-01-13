// utils/updateProfileStats.ts
import { createServerSupabase } from "./supabase/server";

export async function updateProfileStats(userId: string) {
  const supabase = await createServerSupabase();

  // ユーザーの漫画一覧取得
  const { data, error } = await supabase
    .from("mangas")
    .select("chapters")
    .eq("user_id", userId);

  if (error) {
    console.error("mangas fetch error:", error);
    return;
  }

  const total_registered = data.length;
  const total_chapters = data.reduce(
    (sum, m) => sum + (m.chapters ?? 0),
    0
  );

  // プロフィール更新
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      total_registered,
      total_chapters,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("profiles update error:", updateError);
  }
}
