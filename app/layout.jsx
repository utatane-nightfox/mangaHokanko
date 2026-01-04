// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-sky-50">
        <Header />
        {children}
      </body>
    </html>
  );
}
