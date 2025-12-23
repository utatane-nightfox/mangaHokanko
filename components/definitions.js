// components/definitions.js

export const TITLE_DEFINITIONS = [
  { label: "見習い読書家", condition: p => p.total_chapters >= 100 },
  { label: "一般読書家", condition: p => p.total_chapters >= 1000 },
  { label: "中堅読書家", condition: p => p.total_chapters >= 5000 },
  { label: "プロ読書家", condition: p => p.total_chapters >= 10000 },
  { label: "伝導者", condition: p => p.total_chapters >= 100000 },

  { label: "放浪研究家", condition: p => p.total_registered >= 10 },
  { label: "図書館所属研究家", condition: p => p.total_registered >= 100 },
  { label: "王宮所属研究家", condition: p => p.total_registered >= 500 },
  { label: "究明者", condition: p => p.total_registered >= 1000 },

  {
    label: "漫画王",
    condition: p =>
      p.total_chapters >= 100000 && p.total_registered >= 1000,
  },
];

export const ICON_FRAMES = [
  // シンプル
  "red", "pink", "purple", "yellow", "green", "blue",

  // アニメーション（10）
  "glow-gold",
  "glow-rainbow",
  "pulse-blue",
  "sparkle",
  "fire",
  "ice",
  "electric",
  "shadow",
  "angel",
  "dark-magic",
];
