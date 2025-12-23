import "./globals.css";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-sky-50">
        <Header />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
