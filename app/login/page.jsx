"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/callback`,
      },
    });

    if (error) {
      setMessage("ログインメールの送信に失敗しました");
    } else {
      setMessage("マジックリンクをメールで送信しました");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-emerald-600 mb-6">
          メールログイン
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="メールアドレス"
            className="border p-3 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded hover:bg-emerald-600"
            disabled={loading}
          >
            {loading ? "送信中..." : "マジックリンクを送る"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
