import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Manga管理",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-sky-50">
        <Header />
        <main className="pt-20 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
