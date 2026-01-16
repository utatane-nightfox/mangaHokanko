export const ROW_COLORS = [
  { key: "red", label: "赤", class: "border-red-400" },
  { key: "orange", label: "橙", class: "border-orange-400" },
  { key: "yellow", label: "黄", class: "border-yellow-400" },
  { key: "green", label: "緑", class: "border-green-400" },
  { key: "teal", label: "青緑", class: "border-teal-400" },
  { key: "blue", label: "青", class: "border-blue-400" },
  { key: "indigo", label: "藍", class: "border-indigo-400" },
  { key: "purple", label: "紫", class: "border-purple-400" },
  { key: "pink", label: "桃", class: "border-pink-400" },
  { key: "gray", label: "灰", class: "border-gray-400" },
];

export const ROW_COLOR_MAP = Object.fromEntries(
  ROW_COLORS.map(c => [c.key, c.class])
);
