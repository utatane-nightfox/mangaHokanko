// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = createServerSupabase();

  // 🔑 これでマジックリンクのセッション確定
  await supabase.auth.getSession();

  // ❌ ログイン画面には戻さない
  return NextResponse.redirect(new URL("/", request.url));
}
