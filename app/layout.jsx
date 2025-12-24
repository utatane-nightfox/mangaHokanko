import "./globals.css";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-sky-50">
        <Header />
        <main className="pt-24 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
