"use client";

import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useRouter } from "next/navigation";

/*
✅ 機能一覧：
- Supabase認証対応（ユーザーごとにデータ分離）
- 漫画タイトル登録 / 編集 / 削除 / お気に入り
- タイトル重複チェック
- 検索・ソート機能
- 話数分布グラフ表示
*/

export default function MangaHokanko() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [list, setList] = useState([]);
  const [view, setView] = useState("main");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("created_at");
  const [loading, setLoading] = useState(false);

  // 🔹 ログインチェック
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
      else setUser(data.user);
    };
    checkUser();
  }, [router]);

  // 🔹 データ取得
  const fetchList = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("mangaHokanko")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) console.error("fetch error:", error);
    else setList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchList();
  }, [user]);

  // 🔹 フィルタ＆ソート
  const filtered = list
    .filter((m) => {
      if (view === "fav" && !m.favorite) return false;
      return m.title
        ? m.title.toLowerCase().includes(search.toLowerCase())
        : false;
    })
    .sort((a, b) => {
      if (sortMode === "title") {
        return (a.title || "").localeCompare(b.title || "", "ja");
      } else {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

  // 🔹 お気に入り切替
  const toggleFavorite = async (id, cur) => {
    const { error } = await supabase
      .from("mangaHokanko")
      .update({ favorite: !cur })
      .eq("id", id);
    if (error) console.error("fav err", error);
    else await fetchList();
  };

  // 🔹 削除
  const deleteRow = async (id) => {
    if (!confirm("この作品を削除しますか？")) return;
    const { error } = await supabase.from("mangaHokanko").delete().eq("id", id);
    if (error) console.error("delete err", error);
    else await fetchList();
  };

  // 🔹 話数編集
  const editEpisode = async (id, newVal) => {
    const parsed = parseInt(newVal, 10);
    if (isNaN(parsed)) {
      alert("話数は半角数字で入力してください");
      return;
    }
    const { error } = await supabase
      .from("mangaHokanko")
      .update({ episode: parsed })
      .eq("id", id);
    if (error) console.error("edit err", error);
    else await fetchList();
  };

  // 🔹 グラフ用データ生成
  const buildChartData = () => {
    const counts = {};
    (list || []).forEach((m) => {
      const ep = m.episode ?? 0;
      const bucket = Math.floor(ep / 10) * 10;
      counts[bucket] = (counts[bucket] || 0) + 1;
    });
    const keys = Object.keys(counts)
      .map((k) => Number(k))
      .sort((a, b) => a - b);
    return keys.map((k) => ({ bucket: `${k}-${k + 9}`, count: counts[k] }));
  };

  const chartData = buildChartData();

  if (!user) return null;

  return (
    <div className="flex flex-col items-center py-8">
      {/* 🔸 ナビゲーション */}
      <div className="flex gap-6 mb-6">
        <IconButton
          label="一覧"
          color="indigo"
          onClick={() => setView("main")}
          iconPath="M4 6h16M4 12h16M4 18h16"
        />
        <IconButton
          label="登録"
          color="green"
          onClick={() => setView("register")}
          iconPath="M12 5v14M5 12h14"
        />
        <IconButton
          label="お気に入り"
          color="yellow"
          onClick={() => setView("fav")}
          iconPath="M12 17.3l-6.16 3.24 1.18-6.88L2 9.76l6.92-1L12 2l3.08 6.76L22 9.76l-5.02 3.9 1.18 6.88z"
        />
      </div>

      {view === "main" && (
        <MainView
          filtered={filtered}
          search={search}
          setSearch={setSearch}
          sortMode={sortMode}
          setSortMode={setSortMode}
          loading={loading}
          list={list}
          toggleFavorite={toggleFavorite}
          deleteRow={deleteRow}
          editEpisode={editEpisode}
          chartData={chartData}
        />
      )}

{view === "register" && (
  <RegisterForm
    user={user}
    onDone={fetchList}      // ← 登録後に一覧だけ更新
    onBack={() => setView("main")} // ← 戻るボタン押した時だけ一覧へ
  />
)}



      {view === "fav" && (
        <MainView
          filtered={filtered}
          search={search}
          setSearch={setSearch}
          sortMode={sortMode}
          setSortMode={setSortMode}
          loading={loading}
          list={list}
          toggleFavorite={toggleFavorite}
          deleteRow={deleteRow}
          editEpisode={editEpisode}
          chartData={chartData}
          isFavoriteMode
        />
      )}
    </div>
  );
}

/* =======================
   アイコンボタン
======================= */
function IconButton({ label, color, onClick, iconPath }) {
  const colorClass = {
    indigo: "bg-indigo-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
  }[color];
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`icon-btn ${colorClass} text-white px-4 py-2 rounded-full shadow hover:opacity-90 transition`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d={iconPath}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

/* =======================
   一覧画面
======================= */
function MainView({
  filtered,
  search,
  setSearch,
  sortMode,
  setSortMode,
  loading,
  list,
  toggleFavorite,
  deleteRow,
  editEpisode,
  chartData,
  isFavoriteMode,
}) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 border border-indigo-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-indigo-600">
          {isFavoriteMode ? "お気に入り作品" : "登録一覧"}
        </h2>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトル検索"
            className="px-4 py-2 border rounded-xl w-64 text-lg"
          />
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            className="px-3 py-2 border rounded-full"
          >
            <option value="created_at">登録順（最新）</option>
            <option value="title">タイトル順</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-lg">
          <thead>
            <tr className="bg-indigo-50 text-indigo-700">
              <th className="py-3 px-4 text-left">タイトル</th>
              <th className="py-3 px-4 text-left w-32">話数</th>
              <th className="py-3 px-4 text-center w-28">★</th>
              <th className="py-3 px-4 text-center w-40">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="py-6 text-center">
                  読み込み中…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-500">
                  登録がありません
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="border-b hover:bg-indigo-50">
                  <td className="py-3 px-4 font-medium">{m.title}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      defaultValue={m.episode ?? ""}
                      onBlur={(e) => editEpisode(m.id, e.target.value)}
                      className="w-20 p-1 text-center border rounded-md"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleFavorite(m.id, !!m.favorite)}
                      className="text-2xl"
                    >
                      {m.favorite ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => deleteRow(m.id)}
                      className="px-3 py-1 rounded-full bg-red-50 text-red-600 border hover:bg-red-100"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isFavoriteMode && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2 bg-indigo-50 p-4 rounded-xl">
            <h3 className="font-semibold mb-3">話数分布（10話単位）</h3>
            <SimpleBarChart data={chartData} />
          </div>
          <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center border">
            <div className="text-2xl font-bold">{list.length}</div>
            <div className="text-sm text-gray-500 mt-1">合計作品数</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================
   登録フォーム（連続登録対応版）
======================= */
function RegisterForm({ user, onDone }) {
  const [title, setTitle] = useState("");
  const [episode, setEpisode] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return alert("タイトルを入力してください");

    setSaving(true);

    // 🔍 重複チェック
    const { data: existing } = await supabase
      .from("mangaHokanko")
      .select("id")
      .eq("title", title.trim())
      .eq("user_id", user.id);

    if (existing && existing.length > 0) {
      alert("すでに登録済みです");
      setSaving(false);
      return;
    }

    const ep = parseInt(episode, 10) || 0;
    const { error } = await supabase.from("mangaHokanko").insert([
      {
        title: title.trim(),
        episode: ep,
        favorite: false,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("insert error:", error);
      alert("登録できませんでした");
    } else {
      alert("登録しました！🎉");
      setTitle("");
      setEpisode("");
      // ✅ 一覧画面に戻らず、入力フォームを維持
    }

    setSaving(false);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-green-100">
      <h2 className="text-2xl font-bold text-green-600 mb-4">新しい作品を登録</h2>
      <div className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          className="px-4 py-2 border rounded-xl text-lg"
        />
        <input
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
          placeholder="話数（数字）"
          type="number"
          className="px-4 py-2 border rounded-xl text-lg"
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className={`px-6 py-2 rounded-full text-white transition ${
            saving ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {saving ? "登録中..." : "登録する"}
        </button>
        <button onClick={onDone} className="text-gray-500 hover:underline mt-2">
          ← 一覧に戻る
        </button>
      </div>
    </div>
  );
}




/* =======================
   シンプル棒グラフ
======================= */
function SimpleBarChart({ data }) {
  const max = data.reduce((m, d) => Math.max(m, d.count), 0) || 1;
  const width = 460;
  const height = 140;
  const padding = 10;
  const barWidth = (width - padding * 2) / Math.max(1, data.length);

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="w-full">
      <g transform={`translate(${padding},8)`}>
        {data.map((d, i) => {
          const h = (d.count / max) * (height - 40);
          const x = i * barWidth + 4;
          const y = height - h - 34;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth - 8}
                height={h}
                rx="6"
                fill="#6366f1"
                opacity="0.85"
              />
              <text
                x={x + (barWidth - 8) / 2}
                y={height - 18}
                fontSize="10"
                textAnchor="middle"
                fill="#374151"
              >
                {d.bucket}
              </text>
              <text
                x={x + (barWidth - 8) / 2}
                y={y - 4}
                fontSize="10"
                textAnchor="middle"
                fill="#374151"
              >
                {d.count}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
