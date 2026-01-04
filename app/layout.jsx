// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = cookieStore
    .get("next-url")
    ?.value;

  // 🔴 認証チェックをスキップするページ
  const allowPaths = ["/login", "/auth/callback"];

  if (!user && !allowPaths.some((p) => pathname?.startsWith(p))) {
    redirect("/login");
  }

  return (
    <html lang="ja">
      <body className="bg-sky-50 min-h-screen">
        {/* ログイン画面ではHeader非表示 */}
        {user && <Header />}
        {children}
      </body>
    </html>
  );
}
