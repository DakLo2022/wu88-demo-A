// Shared wallet-category data — confirmed live on wu88.live by opening the
// real wallet-category `<select>` (a Vuetify v-select styled as a rounded
// pill, class `.wallet-category-selector`) and, for every one of its 7
// non-"全部" options, reading back which wallets the filtered list actually
// showed (NOT guessed from each wallet's own name — e.g. Super錢包/AP錢包
// have no "體育" in their name but are genuinely 體育投注 wallets on the
// real site, and 武財神電子/真人錢包 — despite the "真人" in its own name —
// only ever showed up under 電子遊戲, never under 真人遊戲). 直播視訊 had
// zero wallets under it on the real site, so that filter legitimately
// renders an empty list here too.
//
// This same underlying data backs THREE different real UI surfaces that all
// happen to reuse the identical wallet list + category filter:
//   - the header's wallet dropdown (MobileWalletPanel.tsx) — a vertical list
//   - the 額度轉換 page (/transfer, MobileTransferScreen.tsx) — a 4-column
//     grid, wrapped in a collapsible "收起/展開" toggle, expanded by default
//   - the 託售 page (/withdrawal, MobileWithdrawalScreen.tsx) — the exact
//     same 4-column grid component, but COLLAPSED by default (confirmed
//     live: /transfer opens already expanded showing "收起", /withdrawal
//     opens collapsed showing "展開" — the only difference between the two
//     pages' grid sections).
export const WALLET_CATEGORIES = [
  "全部錢包",
  "體育投注",
  "真人遊戲",
  "電子遊戲",
  "彩票投注",
  "棋牌遊戲",
  "電競投注",
  "直播視訊",
];

export const SUB_WALLETS: { name: string; category: string }[] = [
  { name: "Super錢包", category: "體育投注" },
  { name: "WG體育錢包", category: "體育投注" },
  { name: "AP錢包", category: "體育投注" },
  { name: "熊貓體育錢包", category: "體育投注" },
  { name: "Live體育錢包", category: "體育投注" },
  { name: "天群體育錢包", category: "體育投注" },
  { name: "MT體育錢包", category: "體育投注" },

  { name: "DG錢包", category: "真人遊戲" },
  { name: "歐博真人錢包", category: "真人遊戲" },
  { name: "WG真人/彩球", category: "真人遊戲" },
  { name: "Astar錢包", category: "真人遊戲" },
  { name: "WM錢包", category: "真人遊戲" },
  { name: "MT真人錢包", category: "真人遊戲" },
  { name: "DB真人錢包", category: "真人遊戲" },
  { name: "T9真人錢包", category: "真人遊戲" },
  { name: "金佰新錢包", category: "真人遊戲" },
  { name: "SA真人錢包", category: "真人遊戲" },

  { name: "Gemini錢包", category: "電子遊戲" },
  { name: "ATG電子錢包", category: "電子遊戲" },
  { name: "武財神電子/真人錢包", category: "電子遊戲" },
  { name: "Ask電子錢包", category: "電子遊戲" },
  { name: "RSG錢包", category: "電子遊戲" },
  { name: "BNG錢包", category: "電子遊戲" },
  { name: "ZG錢包", category: "電子遊戲" },
  { name: "GB錢包", category: "電子遊戲" },
  { name: "QTech錢包", category: "電子遊戲" },
  { name: "RK5電子錢包", category: "電子遊戲" },
  { name: "SPlus電子錢包", category: "電子遊戲" },
  { name: "Tag電子錢包", category: "電子遊戲" },
  { name: "Hacksaw電子錢包", category: "電子遊戲" },
  { name: "Slotmill電子錢包", category: "電子遊戲" },
  { name: "AT電子錢包", category: "電子遊戲" },
  { name: "T9電子錢包", category: "電子遊戲" },

  { name: "9K錢包", category: "彩票投注" },
  { name: "DB彩票錢包", category: "彩票投注" },
  { name: "GPT彩票錢包", category: "彩票投注" },

  { name: "好路錢包", category: "棋牌遊戲" },
  { name: "開心錢包", category: "棋牌遊戲" },
  { name: "高登錢包", category: "棋牌遊戲" },

  { name: "雷火錢包", category: "電競投注" },

  // 直播視訊: confirmed live — zero wallets in this category.
];
