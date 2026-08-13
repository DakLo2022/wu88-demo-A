import { navCategories } from "@/data/nav";

// Client-safe slot definitions (types + pure data/functions only — no
// node:fs / node:path here, so this file can be imported from both Server
// Components and "use client" components like Navbar). Filesystem lookups
// live in lib/imageSlotsServer.ts, which is server-only.

export type ImageSlotCategory = "banner" | "icon" | "logo" | "provider";

/** Pseudo "slot id" (not a real upload slot — never valid for /api/upload-image)
 * used only to store a single shared position/scale setting that applies to
 * every "provider" (廠商) image at once, so the user doesn't have to drag
 * each of the ~90+ vendor images individually. Desktop and mobile each get
 * their own value via the normal mobileSlotKey() suffix, same as any real
 * slot. A provider image that has its own saved position still wins over
 * this global default. */
export const GLOBAL_PROVIDER_SLOT_ID = "__global-provider__";

/** Same idea as GLOBAL_PROVIDER_SLOT_ID, but for the small vendor-logo badge
 * in the top-right corner of each mobile vendor card (see navBadgeSlotId)
 * instead of the card's main art image — kept as a separate pseudo-slot
 * since the badge is a different shape/box and shouldn't share position
 * settings with the art image. */
export const GLOBAL_PROVIDER_BADGE_SLOT_ID = "__global-provider-badge__";

export type ImageSlot = {
  id: string;
  label: string;
  category: ImageSlotCategory;
  width: number;
  height: number;
};

// All image slots on the demo site, grouped by where they render ("banner"
// = full-width layout sections, "icon" = small fixed-size marks). Add a new
// slot here, then reference its id from a component via getSlotImageMap().
export const IMAGE_SLOTS: ImageSlot[] = [
  { id: "hero-slide-1", label: "首頁 Banner 1", category: "banner", width: 1400, height: 440 },
  { id: "hero-slide-2", label: "首頁 Banner 2", category: "banner", width: 1400, height: 440 },
  { id: "hero-slide-3", label: "首頁 Banner 3", category: "banner", width: 1400, height: 440 },
  { id: "hero-slide-4", label: "首頁 Banner 4", category: "banner", width: 1400, height: 440 },

  { id: "promo-card-1", label: "示範專區 1 卡片圖", category: "banner", width: 370, height: 144 },
  { id: "promo-card-2", label: "示範專區 2 卡片圖", category: "banner", width: 370, height: 144 },
  { id: "promo-card-3", label: "示範專區 3 卡片圖", category: "banner", width: 370, height: 144 },
  { id: "promo-card-4", label: "示範專區 4 卡片圖", category: "banner", width: 370, height: 144 },
  { id: "promo-card-5", label: "示範專區 5 卡片圖", category: "banner", width: 370, height: 144 },

  { id: "invite-friends-banner", label: "會員中心 - 邀請好友 滿版banner圖", category: "banner", width: 1000, height: 360 },

  { id: "register-bg", label: "免費註冊頁面 - 背景圖", category: "banner", width: 1600, height: 900 },

  { id: "mobile-login-bg", label: "手機版 登入/註冊/忘記密碼頁 - 背景圖", category: "banner", width: 414, height: 896 },

  // Popup banners shown when clicking the promo-grid cards that open an
  // activity-detail popup (首儲二選一/你跳槽我出資/每日簽到活動 — matches
  // pc.wu88.live's real iframe-promotions popups).
  { id: "promo-popup-2on1-banner", label: "示範專區彈窗 - 首儲二選一 Banner", category: "banner", width: 1000, height: 360 },
  { id: "promo-popup-jumpvip-banner", label: "示範專區彈窗 - 你跳槽我出資 Banner", category: "banner", width: 1000, height: 360 },
  { id: "promo-popup-checkin-banner", label: "示範專區彈窗 - 每日簽到活動 Banner", category: "banner", width: 1000, height: 360 },

  { id: "logo", label: "導覽列 Logo", category: "icon", width: 96, height: 96 },
  { id: "membercentre-logo", label: "會員中心頁面 Logo", category: "icon", width: 130, height: 52 },
  { id: "topbar-register-icon", label: "免費註冊按鈕左側 Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-eye-show", label: "密碼欄位「顯示密碼」Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-eye-hide", label: "密碼欄位「隱藏密碼」Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-member-icon", label: "頂列（登入後）會員中心 Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-mail-icon", label: "頂列（登入後）消息中心 Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-logout-icon", label: "頂列（登入後）登出 Icon", category: "icon", width: 20, height: 20 },
  { id: "promo-icon-1", label: "優惠卡片 1 Icon", category: "icon", width: 64, height: 64 },
  { id: "promo-icon-2", label: "優惠卡片 2 Icon", category: "icon", width: 64, height: 64 },
  { id: "promo-icon-3", label: "優惠卡片 3 Icon", category: "icon", width: 64, height: 64 },
  { id: "promo-icon-4", label: "優惠卡片 4 Icon", category: "icon", width: 64, height: 64 },
  { id: "promo-icon-5", label: "優惠卡片 5 Icon", category: "icon", width: 64, height: 64 },
  { id: "footer-qr-1", label: "Footer QR Code 1", category: "icon", width: 120, height: 120 },
  { id: "footer-qr-2", label: "Footer QR Code 2", category: "icon", width: 120, height: 120 },
  { id: "sidedock-cs", label: "側邊客服 Icon", category: "icon", width: 32, height: 32 },
  { id: "sidedock-line", label: "側邊 Line 客服 Icon", category: "icon", width: 32, height: 32 },
  { id: "sidedock-mail", label: "側邊信箱 Icon", category: "icon", width: 32, height: 32 },
  { id: "sidedock-app", label: "側邊 APP 下載 Icon", category: "icon", width: 32, height: 32 },
  { id: "sidedock-cs-right", label: "右側客服圓形按鈕 Icon", category: "icon", width: 36, height: 36 },

  { id: "mobile-header-wallet-arrow", label: "手機版導覽列 - 錢包選單 下拉箭頭 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-wallet-refresh-icon", label: "手機版錢包彈窗 - 刷新 Icon", category: "icon", width: 16, height: 16 },
  { id: "mobile-wallet-category-arrow", label: "手機版錢包彈窗 - 全部錢包 下拉箭頭 Icon", category: "icon", width: 16, height: 16 },
  { id: "mobile-login-cs-icon", label: "手機版登入/註冊頁 - 客服中心 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-trade-date-icon", label: "手機版帳務頁 - 日期範圍 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-trade-type-arrow", label: "手機版帳務頁 - 選擇類型 下拉箭頭 Icon", category: "icon", width: 16, height: 16 },
  { id: "mobile-trade-empty-illustration", label: "手機版帳務頁 - 無資料插圖", category: "banner", width: 200, height: 200 },
  { id: "mobile-trade-checkbox-check-icon", label: "手機版帳務頁 - 選擇類型 打勾 Icon", category: "icon", width: 14, height: 14 },
  { id: "mobile-back-arrow-icon", label: "手機版子頁面共用 - 返回箭頭 Icon（優惠列表/活動內容/帳務頁/服務頁）", category: "icon", width: 20, height: 20 },
  { id: "mobile-promotions-favorite-icon", label: "手機版優惠頁 - 收藏 Icon", category: "icon", width: 20, height: 20 },

  // 存提彈出選單（首頁底部導覽列「存提」按鈕點擊後浮現的 3 個橘色圓角按鈕）
  { id: "mobile-dw-menu-icon-transfer", label: "手機版存提彈出選單 - 轉點 Icon", category: "icon", width: 36, height: 32 },
  { id: "mobile-dw-menu-icon-deposit", label: "手機版存提彈出選單 - 儲值 Icon", category: "icon", width: 36, height: 32 },
  { id: "mobile-dw-menu-icon-withdrawal", label: "手機版存提彈出選單 - 託售 Icon", category: "icon", width: 36, height: 32 },

  // 額度轉換 (/transfer) 與 託售 (/withdrawal) 共用的錢包格線
  { id: "mobile-wallet-grid-refresh-icon", label: "手機版轉點/託售頁 - 錢包金額 刷新 Icon", category: "icon", width: 16, height: 16 },
  { id: "mobile-wallet-grid-category-arrow", label: "手機版轉點/託售頁 - 全部錢包 下拉箭頭 Icon", category: "icon", width: 16, height: 16 },
  { id: "mobile-wallet-grid-expand-arrow", label: "手機版轉點/託售頁 - 展開/收起 箭頭 Icon", category: "icon", width: 16, height: 16 },

  // 額度轉換 (/transfer) 專屬
  { id: "mobile-transfer-swap-icon", label: "手機版轉點頁 - 轉出/轉入 交換 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-transfer-select-arrow", label: "手機版轉點頁 - 轉出/轉入錢包 下拉箭頭 Icon", category: "icon", width: 16, height: 16 },

  // 儲值 (/deposit) 專屬
  { id: "mobile-deposit-method-bank-icon", label: "手機版儲值頁 - 銀行轉點(第三方) Icon", category: "icon", width: 32, height: 32 },
  { id: "mobile-deposit-method-usdt-icon", label: "手機版儲值頁 - USDT Icon", category: "icon", width: 32, height: 32 },

  // 託售 (/withdrawal) 專屬
  { id: "mobile-withdrawal-method-bank-icon", label: "手機版託售頁 - 銀行卡 Icon", category: "icon", width: 32, height: 32 },
  { id: "mobile-withdrawal-card-check-icon", label: "手機版託售頁 - 已選銀行卡 打勾 Icon", category: "icon", width: 16, height: 16 },
  { id: "mobile-withdrawal-add-icon", label: "手機版託售頁 - 新增銀行卡 Icon", category: "icon", width: 16, height: 16 },

  { id: "mobile-service-banner-1", label: "手機版服務頁 - Banner 1（武財神線上影城）", category: "banner", width: 780, height: 268 },
  { id: "mobile-service-banner-2", label: "手機版服務頁 - Banner 2（武財神真人客服）", category: "banner", width: 780, height: 268 },
  { id: "mobile-service-banner-3", label: "手機版服務頁 - Banner 3（武財神線上商城）", category: "banner", width: 780, height: 268 },
  { id: "mobile-service-client-banner", label: "手機版客服中心頁 - 頂部插圖（24hr真人客服）", category: "banner", width: 700, height: 400 },
  { id: "mobile-service-icon-online", label: "手機版客服中心頁 - 在線客服 Icon", category: "icon", width: 24, height: 24 },
  { id: "mobile-service-icon-line", label: "手機版客服中心頁 - Line客服 Icon", category: "icon", width: 24, height: 24 },
  { id: "mobile-service-icon-email", label: "手機版客服中心頁 - 電子信箱 Icon", category: "icon", width: 24, height: 24 },
  { id: "mobile-service-background", label: "手機版服務頁 - 背景圖", category: "banner", width: 750, height: 1624 },
  { id: "mobile-service-client-background", label: "手機版客服中心頁 - 背景圖", category: "banner", width: 750, height: 1624 },

  { id: "mobile-my-bell-icon", label: "手機版我的頁 - 導覽列通知鈴鐺 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-my-profile-bg", label: "手機版我的頁 - 會員卡背景圖", category: "banner", width: 768, height: 400 },
  { id: "mobile-my-tier-badge-current", label: "手機版我的頁 - 目前等級徽章圖示（銅）", category: "icon", width: 72, height: 80 },
  { id: "mobile-my-tier-badge-next", label: "手機版我的頁 - 下一等級徽章圖示（銀）", category: "icon", width: 72, height: 80 },
  { id: "mobile-my-refresh-icon", label: "手機版我的頁 - 時間列刷新 Icon", category: "icon", width: 16, height: 16 },
  { id: "mobile-my-icon-deposit", label: "手機版我的頁 - 儲值 Icon", category: "icon", width: 24, height: 24 },
  { id: "mobile-my-icon-consign", label: "手機版我的頁 - 託售 Icon", category: "icon", width: 24, height: 24 },
  { id: "mobile-my-icon-wallet", label: "手機版我的頁 - 錢包 Icon", category: "icon", width: 24, height: 24 },
  { id: "mobile-my-icon-bind-account", label: "手機版我的頁 - 綁定帳戶 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-my-icon-account-detail", label: "手機版我的頁 - 帳戶明細 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-my-icon-member-info", label: "手機版我的頁 - 會員資料 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-my-icon-bet-bonus", label: "手機版我的頁 - 投注彩金 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-my-icon-invite", label: "手機版我的頁 - 邀請好友 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-my-icon-security", label: "手機版我的頁 - 安全中心 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-my-icon-help", label: "手機版我的頁 - 協助中心 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-my-list-chevron", label: "手機版我的頁 - 下拉選單箭頭 Icon（帳戶明細/會員資料/協助中心）", category: "icon", width: 20, height: 20 },
  { id: "mobile-my-icon-logout", label: "手機版我的頁 - 登出 Icon", category: "icon", width: 20, height: 20 },

  // 會員等級 (/my/vip-level) — confirmed live this is its own distinct mobile
  // page (AWD, not a shrunk-down copy of the desktop 會員等級 tab): the hero
  // section's orange background is literally a decorative PNG on the real
  // site (wu88.live's Ellipse42.png), not a CSS gradient, so it gets its own
  // upload slot with a gradient fallback like every other decorative
  // background in this project.
  { id: "mobile-vip-hero-bg", label: "手機版會員等級頁 - 頂部橘色裝飾背景圖", category: "banner", width: 750, height: 420 },

  // 邀請好友 (/my/invite) — confirmed live this has its own real mobile
  // layout (share-link card, QR code, stats) below a marketing banner, not
  // just a single full-page image like the desktop InviteFriendsTab. The
  // banner itself (mascot/coin artwork) is the real site's own copyrighted
  // art, so — same as every other marketing banner in this project — it
  // gets its own upload slot instead of being reproduced.
  { id: "mobile-invite-banner", label: "手機版邀請好友頁 - 頂部橫幅圖（邀請好友領雙重好禮）", category: "banner", width: 750, height: 460 },

  // 投注彩金 (/my/bet-bonus) — confirmed live at wu88.live/betting_winnings
  // to be a dark-themed page with its own festive "每日簽到禮" gift-box/coin
  // marketing banner (own copyrighted art, own upload slot like every other
  // banner here) sitting above a black page body — a completely different
  // look from the plain white desktop BettingBonusTab this page used to be
  // built from.
  { id: "mobile-bet-bonus-banner", label: "手機版投注彩金頁 - 頂部橫幅圖（每日簽到禮）", category: "banner", width: 750, height: 380 },

  // Footer vendor/partner logo strip. Upload as many as needed — the
  // footer only renders the ones that actually have a file uploaded.
  { id: "vendor-logo-1", label: "廠商 Logo 1", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-2", label: "廠商 Logo 2", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-3", label: "廠商 Logo 3", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-4", label: "廠商 Logo 4", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-5", label: "廠商 Logo 5", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-6", label: "廠商 Logo 6", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-7", label: "廠商 Logo 7", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-8", label: "廠商 Logo 8", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-9", label: "廠商 Logo 9", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-10", label: "廠商 Logo 10", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-11", label: "廠商 Logo 11", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-12", label: "廠商 Logo 12", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-13", label: "廠商 Logo 13", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-14", label: "廠商 Logo 14", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-15", label: "廠商 Logo 15", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-16", label: "廠商 Logo 16", category: "logo", width: 80, height: 40 },
];

export const VENDOR_LOGO_SLOT_IDS = IMAGE_SLOTS.filter((s) => s.category === "logo").map((s) => s.id);

/** Deterministic slot id for a nav category's Nth provider icon (used as the
 * card's background art on the mobile category explorer). */
export function navProviderSlotId(categoryKey: string, index: number): string {
  return `nav-${categoryKey}-${index}`;
}

/** Deterministic slot id for a nav category's Nth provider's small vendor
 * logo badge — rendered in the top-right corner of the mobile category
 * explorer's vendor card (top-left is the plain-text game name, no upload
 * needed there). */
export function navBadgeSlotId(categoryKey: string, index: number): string {
  return `nav-${categoryKey}-${index}-badge`;
}

/** Slot id for a mobile-only left-rail category icon, default (unselected)
 * state. */
export function mobileCatIconSlotId(categoryKey: string): string {
  return `mobile-cat-${categoryKey}-icon`;
}

/** Slot id for a mobile-only left-rail category icon, active (selected)
 * state — swapped in when that rail button is the current tab. */
export function mobileCatIconActiveSlotId(categoryKey: string): string {
  return `mobile-cat-${categoryKey}-icon-active`;
}

// One icon slot + one vendor-logo badge slot per provider in each nav
// dropdown (hover panel below the navbar / mobile category explorer).
// Generated from data/nav.ts so the count always matches whatever provider
// list is configured there — add/remove a provider in nav.ts and the
// matching upload slots appear/disappear automatically.
export const NAV_PROVIDER_SLOTS: ImageSlot[] = navCategories.flatMap((cat) =>
  cat.providers.flatMap((providerName, idx) => [
    {
      id: navProviderSlotId(cat.key, idx),
      label: `${cat.label} - ${providerName}`,
      category: "provider" as const,
      width: 96,
      height: 96,
    },
    {
      id: navBadgeSlotId(cat.key, idx),
      label: `${cat.label} - ${providerName}（右上角廠商 Logo）`,
      category: "provider" as const,
      width: 48,
      height: 48,
    },
  ])
);

IMAGE_SLOTS.push(...NAV_PROVIDER_SLOTS);

// Two upload slots per mobile left-rail category icon: default + active
// state (tap to switch — the icon can change color/art when selected).
export const MOBILE_CATEGORY_SLOTS: ImageSlot[] = navCategories.flatMap((cat) => [
  {
    id: mobileCatIconSlotId(cat.key),
    label: `手機版左側分類 - ${cat.label} 圖示（預設）`,
    category: "icon" as const,
    width: 24,
    height: 24,
  },
  {
    id: mobileCatIconActiveSlotId(cat.key),
    label: `手機版左側分類 - ${cat.label} 圖示（選中）`,
    category: "icon" as const,
    width: 24,
    height: 24,
  },
]);

IMAGE_SLOTS.push(...MOBILE_CATEGORY_SLOTS);

/** Slot id for a mobile-only bottom tab-bar icon (優惠/帳務/服務/我/存提). */
export function mobileTabIconSlotId(itemId: string): string {
  return `mobile-tab-${itemId}-icon`;
}

export const MOBILE_TAB_ITEMS = [
  { id: "promo", label: "優惠", fallbackEmoji: "🎁" },
  { id: "billing", label: "帳務", fallbackEmoji: "📄" },
  { id: "service", label: "服務", fallbackEmoji: "🎧" },
  { id: "member", label: "我", fallbackEmoji: "👤" },
] as const;

// The raised center "存提" button is kept separate from MOBILE_TAB_ITEMS
// above (rather than a 5th list entry) because MobileBottomNav splits that
// list in half for the two side groups and renders the center button with
// its own distinct raised-circle markup — it needs its own dedicated upload
// slot rather than sharing the site "logo" slot, so it can have its own
// artwork independent of the header/footer logo.
export const MOBILE_TAB_CENTER_ID = "center";

export const MOBILE_TAB_SLOTS: ImageSlot[] = [
  ...MOBILE_TAB_ITEMS.map((item) => ({
    id: mobileTabIconSlotId(item.id),
    label: `手機版底部選單 - ${item.label} 圖示`,
    category: "icon" as const,
    width: 28,
    height: 28,
  })),
  {
    id: mobileTabIconSlotId(MOBILE_TAB_CENTER_ID),
    label: "手機版底部選單 - 存提（中間浮起按鈕）圖示",
    category: "icon" as const,
    width: 28,
    height: 28,
  },
  // The first tab slot swaps from 優惠 to 首頁 (icon AND label) whenever the
  // visitor is actually on the 優惠 list/detail pages — confirmed live on
  // wu88.live/activity/, where the bottom bar's first icon changes to a
  // house and its label to "首頁" so there's still a way back to the
  // homepage. Gets its own dedicated slot rather than reusing the 優惠 one
  // since it's a genuinely different icon (house vs. gift box).
  {
    id: mobileTabIconSlotId("home"),
    label: "手機版底部選單 - 首頁 圖示（在優惠頁時取代「優惠」按鈕）",
    category: "icon" as const,
    width: 28,
    height: 28,
  },
];

IMAGE_SLOTS.push(...MOBILE_TAB_SLOTS);

/** Slot id for the Nth 優惠 (promotions) list-page banner card — same image
 * is reused as the detail page's header banner when that card is tapped. */
export function mobilePromoBannerSlotId(id: string): string {
  return `mobile-promo-${id}`;
}

export const MOBILE_PROMO_IDS = ["1", "2", "3", "4", "5"] as const;

export const MOBILE_PROMO_SLOTS: ImageSlot[] = MOBILE_PROMO_IDS.map((id, idx) => ({
  id: mobilePromoBannerSlotId(id),
  label: `手機版 優惠頁 - 活動卡片 ${idx + 1} Banner`,
  category: "banner" as const,
  width: 780,
  height: 300,
}));

IMAGE_SLOTS.push(...MOBILE_PROMO_SLOTS);

/** Slot id for step N of one of the 協助中心 (Help Center) step-by-step
 * screenshot tutorials. The real site's 超商搜尋流程/USDT儲值流程/支付寶儲值流程
 * tabs are each just a paginated sequence of plain screenshots with no real
 * text content, so each step gets its own upload slot. */
export function helpCenterStepSlotId(flow: string, step: number): string {
  return `help-${flow}-${step}`;
}

const HELP_CENTER_FLOWS: { flow: string; label: string; count: number; width: number; height: number }[] = [
  // 超商搜尋流程 has its own "7-11查詢"/"全家查詢" toggle on the real site,
  // each with a completely separate screenshot sequence (5 steps for 7-11,
  // 7 steps for 全家) — not one shared flow.
  { flow: "storesearch-711", label: "協助中心 - 超商搜尋流程（7-11查詢）", count: 5, width: 820, height: 420 },
  { flow: "storesearch-family", label: "協助中心 - 超商搜尋流程（全家查詢）", count: 7, width: 820, height: 420 },
  { flow: "usdt", label: "協助中心 - USDT儲值流程", count: 6, width: 820, height: 420 },
  { flow: "alipay-register", label: "協助中心 - 支付寶儲值流程（註冊流程）", count: 13, width: 320, height: 600 },
  { flow: "alipay-deposit", label: "協助中心 - 支付寶儲值流程（儲值流程）", count: 2, width: 320, height: 600 },
  // 手機版我的頁 - 協助中心 - 雲支付綁定流程 (confirmed live at
  // /taiwan_pay_illustrate: 15-step phone-screenshot tutorial, "X / Y"
  // counter-style pagination — same shared TutorialSteps viewer pattern as
  // the other flows above).
  { flow: "taiwan-pay", label: "協助中心 - 雲支付綁定流程", count: 15, width: 320, height: 600 },
];

export const HELP_CENTER_SLOTS: ImageSlot[] = HELP_CENTER_FLOWS.flatMap(({ flow, label, count, width, height }) =>
  Array.from({ length: count }, (_, i) => ({
    id: helpCenterStepSlotId(flow, i + 1),
    label: `${label} 步驟${i + 1}/${count}`,
    category: "banner" as const,
    width,
    height,
  }))
);

IMAGE_SLOTS.push(...HELP_CENTER_SLOTS);

export const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"] as const;

const SLOT_ID_SET = new Set<string>(IMAGE_SLOTS.map((s) => s.id));

export function isValidSlotId(slotId: string): boolean {
  return SLOT_ID_SET.has(slotId);
}
