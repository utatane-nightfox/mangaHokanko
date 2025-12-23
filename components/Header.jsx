"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserIcon from "./UserIcon";

export default function Header() {
  const path = usePathname();

  const tabClass = (href) =>
    `px-6 py-3 rounded-full text-lg font-semibold transition
     ${path === href ? "bg-white text-blue-600 shadow" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-sky-300">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        {/* ナビ */}
        <nav className="flex gap-4">
          <Link href="/" className={tabClass("/")}>ホーム</Link>
          <Link href="/register" className={tabClass("/register")}>登録</Link>
          <Link href="/favorites" className={tabClass("/favorites")}>お気に入り</Link>
        </nav>

        {/* ユーザーアイコン */}
        <UserIcon />
      </div>
    </header>
  );
}
