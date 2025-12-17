"use client";

import { Suspense } from "react";
import AuthCallbackInner from "./AuthCallbackInner";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<p>認証中...</p>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
