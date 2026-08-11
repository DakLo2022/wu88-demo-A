import { mobilePromoBannerSlotId, MOBILE_PROMO_IDS } from "@/lib/imageSlots";

// 優惠 (promotions) list confirmed live against wu88.live/activity/: a
// horizontal category filter row (全部/新會員/獨家優惠/百家樂/電子場館/
// VIP特權/體育賽事) above a vertical list of full-width banner cards.
// Titles below are the real headline text visible on those cards live
// (short marketing headlines — functional UI copy, reproduced verbatim per
// this project's standing convention); the 活動名稱/活動時間/活動對象/活動內容
// detail fields for card 1 (商城好禮購) are the real copy confirmed live on
// its detail page. Cards 2-5 only had their headline confirmed live (the
// detail pages weren't reachable this pass), so their detail fields are
// plausible brand-appropriate placeholder copy, same as every other spot in
// this project where the real backend content wasn't reachable.
export const MOBILE_PROMO_CATEGORIES = [
  "全部",
  "新會員",
  "獨家優惠",
  "百家樂",
  "電子場館",
  "VIP特權",
  "體育賽事",
] as const;

export type MobilePromotion = {
  id: string;
  slotId: string;
  category: (typeof MOBILE_PROMO_CATEGORIES)[number];
  title: string;
  period: string;
  audience: string;
  content: string[];
};

export const mobilePromotions: MobilePromotion[] = [
  {
    id: MOBILE_PROMO_IDS[0],
    slotId: mobilePromoBannerSlotId(MOBILE_PROMO_IDS[0]),
    category: "獨家優惠",
    title: "商城好禮購 好禮五選一",
    period: "長期活動",
    audience: "全體會員",
    content: [
      "註冊後累計儲值次數需達3次(含)以上，且所有次數累計加總需達儲值金額5000(含)以上。",
      "符合資格的會員可於指定期間內至商城頁面兌換五選一好禮，每位會員限兌換一次。",
      "本活動最終解釋權歸平台所有，如有調整將另行公告。",
    ],
  },
  {
    id: MOBILE_PROMO_IDS[1],
    slotId: mobilePromoBannerSlotId(MOBILE_PROMO_IDS[1]),
    category: "新會員",
    title: "父愛加倍 苦氣回饋",
    period: "長期活動",
    audience: "新註冊會員",
    content: [
      "新會員首次完成註冊並通過手機驗證後，即可領取新朋友體驗金。",
      "體驗金需完成指定流水倍數後方可提領，詳細規則請洽線上客服。",
      "每位會員、每組裝置、每組銀行帳戶僅限領取一次。",
    ],
  },
  {
    id: MOBILE_PROMO_IDS[2],
    slotId: mobilePromoBannerSlotId(MOBILE_PROMO_IDS[2]),
    category: "獨家優惠",
    title: "彩點川流不止 利息生生不息",
    period: "長期活動",
    audience: "全體會員",
    content: [
      "帳戶內的彩點可設定自動存入生息，依持有天數累積對應利息。",
      "利息將於每日固定時間結算並自動存入會員錢包，無需手動申請。",
      "活動期間平台保有調整利率與資格條件之權利。",
    ],
  },
  {
    id: MOBILE_PROMO_IDS[3],
    slotId: mobilePromoBannerSlotId(MOBILE_PROMO_IDS[3]),
    category: "體育賽事",
    title: "贏了你帶走 負彩我包賠",
    period: "指定賽事期間",
    audience: "全體會員",
    content: [
      "活動期間內，符合資格的指定賽事單注若不幸落敗，可申請包賠回饋。",
      "包賠回饋將以彩金形式發放，需完成指定流水倍數後方可提領。",
      "每位會員每日申請次數與單筆上限請以活動頁面公告為準。",
    ],
  },
  {
    id: MOBILE_PROMO_IDS[4],
    slotId: mobilePromoBannerSlotId(MOBILE_PROMO_IDS[4]),
    category: "獨家優惠",
    title: "全民皆代理 分享就分成",
    period: "長期活動",
    audience: "全體會員",
    content: [
      "會員可透過專屬推薦連結邀請好友加入，好友完成首儲即可獲得推薦獎金。",
      "推薦人並可依好友的長期活躍程度，持續獲得分潤回饋。",
      "詳細分潤比例與結算方式請至會員中心的邀請好友頁面查看。",
    ],
  },
];

export function getMobilePromotionById(id: string): MobilePromotion | undefined {
  return mobilePromotions.find((p) => p.id === id);
}
