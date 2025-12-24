import "./globals.css";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
