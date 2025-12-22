import { Suspense } from "react";
import AuthCallbackInner from "./AuthCallbackInner";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="p-6">ログイン処理中…</div>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
