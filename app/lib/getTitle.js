export function getAvailableTitles(totalChapters = 0, totalRegistered = 0) {
  const titles = [];

  // 📘 合計話数称号
  if (totalChapters >= 100) titles.push("見習い読書家");
  if (totalChapters >= 1000) titles.push("一般読書家");
  if (totalChapters >= 5000) titles.push("中堅読書家");
  if (totalChapters >= 10000) titles.push("プロ読書家");
  if (totalChapters >= 100000) titles.push("伝導者");

  // 📚 合計登録数称号
  if (totalRegistered >= 10) titles.push("放浪研究家");
  if (totalRegistered >= 100) titles.push("図書館所属研究家");
  if (totalRegistered >= 500) titles.push("王宮所属研究家");
  if (totalRegistered >= 1000) titles.push("究明者");

  // 👑 最上級条件
  if (totalChapters >= 100000 && totalRegistered >= 1000) {
    titles.push("漫画王");
  }

  return titles;
}
