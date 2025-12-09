// utils/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createServerSupabase() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // ResponseCookies の set を使えるようにするため any にキャスト
          (cookieStore as any).set(name, value, options);
        },
        remove(name: string, options: any) {
          (cookieStore as any).set(name, "", {
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );
}
