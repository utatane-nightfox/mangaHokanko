// utils/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createServerSupabase() {
  // Next.js 15 では cookies() が Promise になった
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },

        set(name: string, value: string, options?: any) {
          try {
            (cookieStore as any).set({
              name,
              value,
              ...options,
            });
          } catch (e) {
            console.error("Cookie set error:", e);
          }
        },

        remove(name: string, options?: any) {
          try {
            (cookieStore as any).set({
              name,
              value: "",
              maxAge: 0,
              ...options,
            });
          } catch (e) {
            console.error("Cookie remove error:", e);
          }
        },
      },
    }
  );
}
