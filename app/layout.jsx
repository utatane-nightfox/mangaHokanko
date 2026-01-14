import "./globals.css";
import Header from "../components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-sky-50 text-gray-800">
        <Header />

        {/* ★ ここが重要 */}
        <main className="pt-24 px-6 min-h-screen">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}
