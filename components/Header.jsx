"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-teal-200">
      <div className="flex gap-4">
        <Link href="/">ホーム</Link>
        <Link href="/register">登録</Link>
        <Link href="/favorites">お気に入り</Link>
      </div>

      {/* 右側は UserHeader を呼ぶだけ */}
      <div>
        {/* ここに UserHeader を置く */}
      </div>
    </header>
  );
}
