// app/layout.jsx  ← サーバーコンポーネントに戻す

import "./globals.css";
import "../lib/frameStyles.css";
import UserHeader from "./UserHeader"; // ← クライアント側のヘッダーに移動

export const metadata = {
  title: "mangaHokanko",
  description: "マンガ保管庫アプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        {/* ここはクライアントコンポーネント */}
        <UserHeader />

        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
