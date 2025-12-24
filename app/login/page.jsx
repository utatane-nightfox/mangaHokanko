"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email | otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP送信
  const sendOtp = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setStep("otp");
    setLoading(false);
  };

  // OTP確認
  const verifyOtp = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">ログイン</h1>

        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-sky-500 text-white py-2 rounded"
            >
              {loading ? "送信中…" : "6桁コードを送信"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="6桁コード"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded p-2 text-center tracking-widest"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              {loading ? "確認中…" : "ログイン"}
            </button>
          </>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
