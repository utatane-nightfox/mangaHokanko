"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = supabaseBrowser();

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage("メール送信に失敗しました");
    } else {
      setMessage("マジックリンクをメールに送信しました");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-green-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-sky-700">
          ログイン
        </h2>
        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="email"
            placeholder="メールアドレス"
            className="border p-2 w-full rounded"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white w-full py-2 rounded"
            disabled={loading}
          >
            {loading ? "送信中..." : "マジックリンクを送信"}
          </button>
        </form>
        {message && (
          <p className="text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
