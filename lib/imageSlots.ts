import { navCategories } from "@/data/nav";

// Client-safe slot definitions (types + pure data/functions only — no
// node:fs / node:path here, so this file can be imported from both Server
// Components and "use client" components like Navbar). Filesystem lookups
// live in lib/imageSlotsServer.ts, which is server-only.

export type ImageSlotCategory = "banner" | "icon" | "logo" | "provider";

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

/** Deterministic slot id for a nav category's Nth provider icon. */
export function navProviderSlotId(categoryKey: string, index: number): string {
  return `nav-${categoryKey}-${index}`;
}

// One icon slot per provider in each nav dropdown (hover panel below the
// navbar). Generated from data/nav.ts so the count always matches whatever
// provider list is configured there — add/remove a provider in nav.ts and
// the matching upload slot appears/disappears automatically.
export const NAV_PROVIDER_SLOTS: ImageSlot[] = navCategories.flatMap((cat) =>
  cat.providers.map((providerName, idx) => ({
    id: navProviderSlotId(cat.key, idx),
    label: `${cat.label} - ${providerName}`,
    category: "provider" as const,
    width: 96,
    height: 96,
  }))
);

IMAGE_SLOTS.push(...NAV_PROVIDER_SLOTS);

export const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"] as const;

const SLOT_ID_SET = new Set<string>(IMAGE_SLOTS.map((s) => s.id));

export function isValidSlotId(slotId: string): boolean {
  return SLOT_ID_SET.has(slotId);
}
