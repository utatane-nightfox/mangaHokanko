"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow space-y-6">
        <h1 className="text-2xl font-bold text-center">
          ログイン
        </h1>

        {sent ? (
          <div className="text-center text-green-600">
            📩 ログイン用リンクを送信しました。<br />
            メールをご確認ください。
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-4 py-2"
            />

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !email}
              className="w-full bg-sky-500 text-white py-2 rounded font-bold disabled:opacity-50"
            >
              {loading ? "送信中…" : "ログインリンクを送る"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
