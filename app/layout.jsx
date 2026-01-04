import "./globals.css";
import Header from "@/components/Header";
import { supabaseServer } from "@/utils/supabase/server";

export default async function RootLayout({ children }) {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="ja">
      <body className="bg-sky-50">
        {/* ログイン中のみ Header 表示 */}
        {session && <Header />}
        <main className={session ? "pt-24" : ""}>{children}</main>
      </body>
    </html>
  );
}
