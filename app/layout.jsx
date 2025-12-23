import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Manga管理",
  description: "漫画管理アプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-slate-50">
        {/* Header はここだけ */}
        <Header />
        <main className="pt-16 px-6">{children}</main>
      </body>
    </html>
  );
}
