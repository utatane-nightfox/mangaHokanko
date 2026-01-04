"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/callback`,
      },
    });

    if (error) {
      setError("メール送信に失敗しました");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-green-100">
      <div className="bg-white/80 backdrop-blur p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Manga保管庫 ログイン
        </h1>

        {sent ? (
          <p className="text-center text-green-700">
            📩 ログイン用リンクを送信しました<br />
            メールをご確認ください
          </p>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-2 rounded-full transition disabled:opacity-50"
            >
              {loading ? "送信中…" : "ログインリンクを送る"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
