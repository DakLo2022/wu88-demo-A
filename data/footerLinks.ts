export type FooterGroup = {
  title: string;
  links: string[];
};

// Invented placeholder vendor names (not pulled from any real site) so each
// footer column reads as a "full" list rather than a sparse "A/B/C" stand-in.
export const footerGroups: FooterGroup[] = [
  {
    title: "電子",
    links: [
      "ATG電子", "武財神電子", "T9電子", "RSG電子",
      "BNG電子", "ZG電子", "WM電子", "GB電子",
      "好路電子", "GEMINI電子", "QT電子", "RK5電子",
      "Tag電子", "Ask電子", "SPlus電子", "Hacksaw電子",
      "Slotmill電子", "AT電子",
    ],
  },
  {
    title: "體育",
    links: ["SUPER體育", "WG體育", "AP體育", "熊貓體育", "Live體育", "天群體育"],
  },
  {
    title: "真人",
    links: [
      "DG真人", "WM真人", "MT真人", "T9真人",
      "Astar真人", "WG真人", "歐博真人", "DB真人", "金佰新真人",
    ],
  },
  { title: "彩球", links: ["WG彩球", "9K彩球", "DB彩球", "永續高登彩球"] },
  { title: "棋牌", links: ["高登棋牌", "好路棋牌", "開心棋牌"] },
  { title: "捕魚", links: ["好路捕魚", "開心捕魚"] },
  { title: "電競", links: ["雷火電競"] },
];

export const footerMeta = {
  version: "WU88",
  aboutLabel: "關於我們",
  faqLabel: "常見問題",
  siteMapLabel: "網站導覽",
  appTitle: "Demo APP",
  appSubtitle: "即時娛樂 隨時享受",
};
