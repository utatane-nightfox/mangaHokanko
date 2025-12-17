"use client";

import { Suspense } from "react";
import AuthCallbackInner from "./AuthCallbackInner";

export const dynamic = "force-dynamic";  // ← これだけでOK
// revalidate や fetchCache は絶対に書かない

export default function Page() {
  return (
    <Suspense fallback={<p>認証中...</p>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
