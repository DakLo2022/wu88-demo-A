export type PromoCard = {
  id: string;
  bgSlotId: string;
  iconSlotId: string;
  title: string;
  subtitle: string;
  fallbackIcon: string;
  accentClass: string;
};

// Placeholder promo tiles. `bgSlotId` maps to the card's full background
// image slot, `iconSlotId` to a small corner-icon slot; when nothing has
// been uploaded yet the card falls back to fallbackIcon + gradient.
export const promoCards: PromoCard[] = [
  { id: "promo-1", bgSlotId: "promo-card-1", iconSlotId: "promo-icon-1", title: "WU88影城上線", subtitle: "", fallbackIcon: "🎬", accentClass: "from-brand-orange/50 to-brand-dark" },
  { id: "promo-2", bgSlotId: "promo-card-2", iconSlotId: "promo-icon-2", title: "你跳槽我出資", subtitle: "", fallbackIcon: "🏍️", accentClass: "from-sky-500/40 to-brand-dark" },
  { id: "promo-3", bgSlotId: "promo-card-3", iconSlotId: "promo-icon-3", title: "首儲二選一怎麼選都賺", subtitle: "", fallbackIcon: "💰", accentClass: "from-red-500/40 to-brand-dark" },
  { id: "promo-4", bgSlotId: "promo-card-4", iconSlotId: "promo-icon-4", title: "WU88線上商城", subtitle: "", fallbackIcon: "🛍️", accentClass: "from-emerald-500/40 to-brand-dark" },
  { id: "promo-5", bgSlotId: "promo-card-5", iconSlotId: "promo-icon-5", title: "每日簽到活動", subtitle: "", fallbackIcon: "📅", accentClass: "from-purple-500/40 to-brand-dark" },
];

export type Announcement = {
  id: string;
  tag: string;
  text: string;
};

export const announcements: Announcement[] = [
  { id: "a1", tag: "公告", text: "這是示範公告文字，實際上線前請替換為真實內容。" },
  { id: "a2", tag: "公告", text: "此區塊為跑馬燈示意，資料來源為 mock 檔案。" },
  { id: "a3", tag: "公告", text: "Demo 站台不含任何真實交易或會員資料。" },
];

export type HeroSlide = {
  id: string;
  slotId: string;
  title: string;
  label: string;
};

export const heroSlides: HeroSlide[] = [
  { id: "s1", slotId: "hero-slide-1", title: "示範主視覺 1", label: "首頁 Banner 示意區塊" },
  { id: "s2", slotId: "hero-slide-2", title: "示範主視覺 2", label: "首頁 Banner 示意區塊" },
  { id: "s3", slotId: "hero-slide-3", title: "示範主視覺 3", label: "首頁 Banner 示意區塊" },
  { id: "s4", slotId: "hero-slide-4", title: "示範主視覺 4", label: "首頁 Banner 示意區塊" },
];
