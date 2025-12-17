"use client";

import { Suspense } from "react";
import AuthCallbackInner from "./AuthCallbackInner";

export const dynamic = "force-dynamic"; 
export const revalidate = 0;            // ★ 追加：SSRキャッシュ防止
export const fetchCache = "force-no-store"; // ★ 追加：完全に静的化を避ける

export default function Page() {
  return (
    <Suspense fallback={<p>認証中...</p>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
