"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/`,
      },
    });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-center">ログイン</h1>

        {sent ? (
          <p className="text-center text-green-600">
            📩 メールを確認してください
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-sky-500 text-white py-2 rounded font-bold"
            >
              ログインリンク送信
            </button>
          </>
        )}
      </div>
    </main>
  );
}
