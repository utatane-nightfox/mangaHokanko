"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = supabaseBrowser();

  // ① メール送信
  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setMessage("メール送信に失敗しました");
    } else {
      setSent(true);
      setMessage("6桁コードをメールに送信しました");
    }

    setLoading(false);
  };

  // ② コード入力・認証
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = e.target.token.value;

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      setMessage("コードが間違っています");
    } else {
      window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        {!sent ? (
          <form onSubmit={handleSend} className="space-y-4">
            <h2 className="text-xl font-bold">メールログイン</h2>
            <input
              type="email"
              placeholder="メールアドレス"
              className="border p-2 w-full rounded"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white w-full py-2 rounded"
              disabled={loading}
            >
              {loading ? "送信中..." : "6桁コードを送る"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-xl font-bold">コード入力</h2>
            <input
              name="token"
              type="text"
              placeholder="6桁コード"
              className="border p-2 w-full rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white w-full py-2 rounded"
              disabled={loading}
            >
              {loading ? "認証中..." : "ログイン"}
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}