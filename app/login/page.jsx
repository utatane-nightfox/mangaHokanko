"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email | otp
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // OTP送信
  const sendOtp = async () => {
    if (!email) return;
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // 未登録でもOK
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setStep("otp");
    setMessage("6桁の認証コードをメールで送信しました");
  };

  // OTP確認
  const verifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    setLoading(false);

    if (error) {
      setMessage("コードが正しくありません");
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">ログイン</h1>

        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="メールアドレス"
              className="w-full border p-3 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-sky-500 text-white py-3 rounded"
            >
              {loading ? "送信中…" : "認証コードを送信"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6桁の認証コード"
              className="w-full border p-3 rounded text-center tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded"
            >
              {loading ? "確認中…" : "ログイン"}
            </button>
          </>
        )}

        {message && (
          <div className="text-center text-sm text-gray-600">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
