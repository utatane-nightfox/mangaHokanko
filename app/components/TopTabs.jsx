"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopTabs() {
  const path = usePathname();
  const tab = (href, label) => (
    <Link
      href={href}
      className={`px-4 py-2 rounded ${
        path === href ? "bg-blue-500 text-white" : "bg-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed top-0 w-full bg-gray-200 p-3 flex gap-3 z-50">
      {tab("/", "検索")}
      {tab("/register", "登録")}
      {tab("/favorites", "お気に入り")}
      {tab("/profile", "プロフィール")}
    </header>
  );
}
