import "./globals.css";
import Header from "../components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-sky-50 text-gray-800">
        <Header />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}
