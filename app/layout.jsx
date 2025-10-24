// app/layout.jsx
import './globals.css';

export const metadata = {
  title: '漫画保管庫',
  description: 'お気に入り漫画を登録・管理するアプリ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 text-gray-800">
        <header className="w-full py-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
            <h1 className="text-2xl font-extrabold text-indigo-600">📚 漫画保管庫</h1>
            {/* ここは説明文など短めに */}
            <div className="text-sm text-gray-500">データはクラウド保存（Supabase）されます</div>
          </div>
        </header>

        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4">
            {children}
          </div>
        </main>

        <footer className="py-6">
          <div className="max-w-4xl mx-auto text-center text-sm text-gray-400">© 漫画保管庫</div>
        </footer>
      </body>
    </html>
  );
}
