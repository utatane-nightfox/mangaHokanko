'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'


import { FaStar, FaRegStar, FaTrash, FaEdit } from 'react-icons/fa'

export default function ListPage() {
  const [mangaList, setMangaList] = useState([])
  const [sortType, setSortType] = useState('created_at')

  // データ取得
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('manga_list')
      .select('*')
      .order(sortType, { ascending: sortType === 'title' })

    if (error) console.error(error)
    else setMangaList(data)
  }

  useEffect(() => {
    fetchData()
  }, [sortType])

  // お気に入り切り替え
  const toggleFavorite = async (id, currentValue) => {
    const { error } = await supabase
      .from('manga_list')
      .update({ favorite: !currentValue })
      .eq('id', id)

    if (error) console.error(error)
    fetchData()
  }

  // 話数編集
  const editEpisode = async (id, newValue) => {
    const { error } = await supabase
      .from('manga_list')
      .update({ episode: parseInt(newValue, 10) })
      .eq('id', id)
    if (error) console.error(error)
    fetchData()
  }

  // データ削除
  const deleteManga = async (id) => {
    if (!confirm('削除してもよろしいですか？')) return
    const { error } = await supabase.from('manga_list').delete().eq('id', id)
    if (error) console.error(error)
    fetchData()
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-100 to-blue-100 py-10">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg border border-indigo-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">漫画一覧</h1>

        {/* 並び替えボタン */}
        <div className="flex justify-end mb-4 space-x-4">
          <button
            onClick={() => setSortType('title')}
            className={`px-4 py-2 rounded-full border ${
              sortType === 'title'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            名前順
          </button>
          <button
            onClick={() => setSortType('created_at')}
            className={`px-4 py-2 rounded-full border ${
              sortType === 'created_at'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            登録順
          </button>
        </div>

        {/* 一覧表 */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-indigo-200 bg-indigo-50 text-indigo-700">
              <th className="py-3 text-left px-4">タイトル</th>
              <th className="py-3 text-left px-4">話数</th>
              <th className="py-3 text-center px-4">お気に入り</th>
              <th className="py-3 text-center px-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {mangaList.map((manga) => (
              <tr
                key={manga.id}
                className="border-b border-gray-200 hover:bg-indigo-50 transition"
              >
                <td className="py-3 px-4 font-medium text-gray-800">{manga.title}</td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    defaultValue={manga.episode}
                    onBlur={(e) => editEpisode(manga.id, e.target.value)}
                    className="w-20 border border-gray-300 rounded-md p-1 text-center"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => toggleFavorite(manga.id, manga.favorite)}>
                    {manga.favorite ? (
                      <FaStar className="text-yellow-400 text-xl" />
                    ) : (
                      <FaRegStar className="text-gray-400 text-xl" />
                    )}
                  </button>
                </td>
                <td className="py-3 px-4 text-center space-x-3">
                  <button
                    onClick={() =>
                      editEpisode(
                        manga.id,
                        prompt('新しい話数を入力してください', manga.episode)
                      )
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteManga(manga.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* グラフっぽい区切り */}
        <div className="mt-10 border-t border-dashed border-indigo-300"></div>
        <div className="text-center text-gray-500 mt-4">📘 合計: {mangaList.length} 作品</div>
      </div>
    </div>
  )
}
