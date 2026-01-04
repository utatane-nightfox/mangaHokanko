import "./globals.css";
import Header from "@/components/Header";
import { supabaseServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔐 未ログインは強制ログイン画面へ
  if (!user) {
    redirect("/login");
  }

  return (
    <html lang="ja">
      <body className="bg-sky-50 min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
