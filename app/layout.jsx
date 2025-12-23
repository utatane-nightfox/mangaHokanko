import "./globals.css";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-sky-50">
        {/* 上部固定ヘッダー */}
        <Header />

        {/* ヘッダー分の余白を必ず確保 */}
        <main className="pt-24 px-6 max-w-5xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
