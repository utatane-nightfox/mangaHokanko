// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔒 未ログインならログイン画面へ強制
  if (!user) {
    redirect("/login");
  }

  return (
    <html lang="ja">
      <body className="bg-sky-50 min-h-screen">
        {/* ✅ ログイン中のみヘッダー表示 */}
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
