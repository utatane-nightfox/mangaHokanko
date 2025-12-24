// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "漫画管理アプリ",
  description: "漫画の話数管理",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-sky-50">
        <Header />
        <main className="pt-24 max-w-6xl mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
