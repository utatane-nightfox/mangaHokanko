"use client";

import { useState } from "react";
import { supabaseBrowser } from "../../utils/supabase/client";

export default function LoginPage() {
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMagicLink = async () => {
    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-white rounded-2xl p-8 shadow w-[360px]">
        <h1 className="text-2xl font-bold mb-6 text-center">
          メールログイン
        </h1>

        {sent ? (
          <p className="text-center text-sm text-gray-600">
            メールを送信しました。<br />
            届いたリンクを開いてください。
          </p>
        ) : (
          <>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {errorMsg && (
              <p className="text-red-500 text-sm mb-2">{errorMsg}</p>
            )}

            <button
              onClick={sendMagicLink}
              disabled={loading}
              className="w-full bg-emerald-400 text-white py-2 rounded hover:bg-emerald-500 disabled:opacity-50"
            >
              ログインリンクを送信
            </button>
          </>
        )}
      </div>
    </div>
  );
}
