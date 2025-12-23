"use client";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-4">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="🔎 検索"
        className="
          w-full
          pl-10 pr-4 py-2
          rounded-full
          border
          shadow-sm
          focus:outline-none
        "
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
    </div>
  );
}
