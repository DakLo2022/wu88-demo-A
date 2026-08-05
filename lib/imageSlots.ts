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

  { id: "logo", label: "導覽列 Logo", category: "icon", width: 96, height: 96 },
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
];

IMAGE_SLOTS.push(...MOBILE_TAB_SLOTS);

export const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"] as const;

const SLOT_ID_SET = new Set<string>(IMAGE_SLOTS.map((s) => s.id));

export function isValidSlotId(slotId: string): boolean {
  return SLOT_ID_SET.has(slotId);
}
