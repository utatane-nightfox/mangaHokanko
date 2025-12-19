import "./globals.css";
import TopTabs from "./components/TopTabs";

export const metadata = {
  title: "mangaHokanko",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-gray-100">
        <TopTabs />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
