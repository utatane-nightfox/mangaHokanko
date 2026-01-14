import "./globals.css";
import Header from "../components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-sky-50 min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
