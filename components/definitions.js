// components/definitions.js

export const ICON_FRAMES = [
  { key: "none", class: "" },

  { key: "red", class: "frame-red" },
  { key: "pink", class: "frame-pink" },
  { key: "purple", class: "frame-purple" },
  { key: "yellow", class: "frame-yellow" },
  { key: "green", class: "frame-green" },
  { key: "blue", class: "frame-blue" },

  { key: "glow", class: "frame-glow" },
  { key: "spin", class: "frame-spin" },
  { key: "pulse", class: "frame-pulse" },
  { key: "rainbow", class: "frame-rainbow" },
];

export const TITLE_DEFINITIONS = [
  {
    label: "見習い読書家",
    condition: "総話数が10話以上",
    check: (p) => p.total_chapters >= 10,
  },
  {
    label: "読書好き",
    condition: "総話数が50話以上",
    check: (p) => p.total_chapters >= 50,
  },
  {
    label: "漫画マスター",
    condition: "総話数が100話以上",
    check: (p) => p.total_chapters >= 100,
  },
];
