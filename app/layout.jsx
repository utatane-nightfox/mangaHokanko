import "./globals.css";
import Header from "@/components/Header";
import { supabaseServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔐 未ログインなら強制ログイン
  if (!user) {
    redirect("/login");
  }

  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
