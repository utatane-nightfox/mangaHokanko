"use client";

export default function MangaRow({ manga, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center justify-between
        p-4 rounded-xl border
        hover:bg-sky-50 hover:shadow
        transition cursor-pointer
      "
    >
      {/* 左 */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
          {manga.total_chapters}
        </div>

        <div>
          <div className="font-bold text-lg">{manga.title}</div>
          <div className="text-sm text-gray-500">
            最終更新: {new Date(manga.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* 右 */}
      <div className="text-sm text-gray-400">
        ▶
      </div>
    </div>
  );
}
