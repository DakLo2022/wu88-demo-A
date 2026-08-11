// Shared data for the mobile 我的 (My) page's second-layer screens. Kept
// separate from data/helpCenter.ts since this covers VIP tiers, language/
// timezone pickers, and security-menu config rather than the 協助中心 tutorial
// content.

export type MobileVipTier = {
  tier: string;
  name: string;
  /** "所需流水" turnover required to reach this tier — confirmed live for all
   * 10 tiers on wu88.live's real mobile 會員等級 page (/vip_level), reading
   * every slide of its swiper: 0/60000/500000/1000000/5000000/10000000/
   * 15000000/30000000/60000000/9999999999999. */
  turnoverRequired: string;
  /** "每日託售次數" — confirmed live to be the fixed value "1次" for every
   * tier (checked VIP1/2/3/10, all identical), not scaled per tier. */
  dailyConsignCount: string;
  /** "每日點數託售額度" — confirmed live to be the fixed value "1000000" for
   * every tier (same check as above). */
  dailyConsignLimit: string;
  /** "升級獎金"/"生日禮" — confirmed live across all 10 tiers by paging
   * through the real 會員等級 swiper; these happen to match the desktop
   * 會員等級 table's upgradeBonus/birthdayBonus columns exactly. */
  upgradeBonus: string;
  birthdayBonus: string;
};

// Tier names/order confirmed live (note VIP8/9/10 use different names from
// the desktop table: 聚寶盆/搖錢樹/財神, not 傳說/至尊/王者 — mobile and
// desktop diverge here, so these are taken from the mobile site directly).
export const MOBILE_VIP_TIERS: MobileVipTier[] = [
  { tier: "VIP1", name: "銅", turnoverRequired: "0", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "0", birthdayBonus: "88" },
  { tier: "VIP2", name: "銀", turnoverRequired: "60000", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "88", birthdayBonus: "188" },
  { tier: "VIP3", name: "金", turnoverRequired: "500000", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "188", birthdayBonus: "388" },
  { tier: "VIP4", name: "白金", turnoverRequired: "1000000", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "688", birthdayBonus: "888" },
  { tier: "VIP5", name: "鑽", turnoverRequired: "5000000", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "1888", birthdayBonus: "1088" },
  { tier: "VIP6", name: "金鑽", turnoverRequired: "10000000", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "2888", birthdayBonus: "1288" },
  { tier: "VIP7", name: "鬼推磨", turnoverRequired: "15000000", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "5888", birthdayBonus: "3888" },
  { tier: "VIP8", name: "聚寶盆", turnoverRequired: "30000000", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "8888", birthdayBonus: "5888" },
  { tier: "VIP9", name: "搖錢樹", turnoverRequired: "60000000", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "13888", birthdayBonus: "8888" },
  { tier: "VIP10", name: "財神", turnoverRequired: "9999999999999", dailyConsignCount: "1次", dailyConsignLimit: "1000000", upgradeBonus: "18888", birthdayBonus: "13888" },
];

export const LANGUAGE_OPTIONS = ["繁體中文", "English", "Tiếng Việt"] as const;

// GMT offset picker — confirmed live as a long flat list of "GMT±HH:MM"
// options (not IANA city names). +08:00 (Taiwan) is the default.
export const TIMEZONE_OPTIONS = [
  "GMT-12:00", "GMT-11:00", "GMT-10:00", "GMT-09:00", "GMT-08:00", "GMT-07:00",
  "GMT-06:00", "GMT-05:00", "GMT-04:00", "GMT-03:00", "GMT-02:00", "GMT-01:00",
  "GMT+00:00", "GMT+01:00", "GMT+02:00", "GMT+03:00", "GMT+03:30", "GMT+04:00",
  "GMT+04:30", "GMT+05:00", "GMT+05:30", "GMT+05:45", "GMT+06:00", "GMT+06:30",
  "GMT+07:00", "GMT+08:00", "GMT+09:00", "GMT+09:30", "GMT+10:00", "GMT+11:00",
  "GMT+12:00", "GMT+13:00",
] as const;

export const DEFAULT_TIMEZONE = "GMT+08:00";

export type SecurityRow = {
  key: "login" | "consign" | "reset";
  icon: string;
  label: string;
  color: string;
  href: string;
};

// Matches desktop MemberCentreModal's SecurityTab sub-tabs (same 3 items,
// same fixed purple/orange/teal colors, screenshot-confirmed against
// pc.wu88.live) — reproduced here as 3 separate mobile pages instead of 3
// in-page sub-tabs, since 安全中心 on mobile is its own list page.
export const SECURITY_ROWS: SecurityRow[] = [
  { key: "login", icon: "🔑", label: "修改登入密碼", color: "#9c27b0", href: "/my/security/login-password" },
  { key: "consign", icon: "🔒", label: "修改託售密碼", color: "#ff9800", href: "/my/security/consign-password" },
  { key: "reset", icon: "🔄", label: "重設託售密碼", color: "#009688", href: "/my/security/reset-password" },
];

// 邀請詳情 (/invite_friend/detail)'s "好友流水分成" tab — confirmed live to
// have real demo rows (unlike its "好友首存禮金" tab, which is empty).
// Reproduced verbatim: plain functional account-list rows, not creative/
// marketing content.
export type InviteFriendRow = { name: string; registeredAt: string; effectiveTurnover: string; unclaimed: string; claimed: string };

export const INVITE_FRIEND_TURNOVER_ROWS: InviteFriendRow[] = [
  { name: "Heather777 (1)", registeredAt: "2024-04-15", effectiveTurnover: "0", unclaimed: "0", claimed: "0" },
  { name: "Linda111 (1)", registeredAt: "2024-04-16", effectiveTurnover: "0", unclaimed: "0", claimed: "0" },
  { name: "Geodown666 (1)", registeredAt: "2024-04-16", effectiveTurnover: "0", unclaimed: "0", claimed: "0" },
  { name: "Heather555 (1)", registeredAt: "2024-04-16", effectiveTurnover: "0", unclaimed: "0", claimed: "0" },
  { name: "Geo1234 (1)", registeredAt: "2024-04-20", effectiveTurnover: "0", unclaimed: "0", claimed: "0" },
  { name: "z0913806326 (1)", registeredAt: "2024-06-04", effectiveTurnover: "0", unclaimed: "0", claimed: "0" },
];
