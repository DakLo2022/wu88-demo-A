// Content for the promo-grid popups, condensed/paraphrased from the real
// activity pages at iframe-promotions.wu88.live (2on1.html, jump_vip.html,
// betting_winnings.html) rather than reproduced verbatim — those pages run
// several long paragraphs per section; this keeps the same facts (amounts,
// thresholds, deadlines) in shorter form, consistent with how the rest of
// this demo handles the site's lengthy rules/terms text.

export type PromoPopupSection = {
  heading: string;
  paragraphs: string[];
};

export type PromoPopupContent = {
  bannerSlotId: string;
  name: string;
  period: string;
  audience?: string;
  sections: PromoPopupSection[];
};

// Shared closing rules block — same standard terms reproduced (paraphrased)
// across every WU88 promo page on the real site, including the 投注彩金
// member-centre tab.
export const WU88_TERMS_SECTION: PromoPopupSection = {
  heading: "WU88規則與條款",
  paragraphs: [
    "優惠使用限制：不得將此優惠點數投入德州撲克、Black jack21點，賽車/飛艇類彩票單局下注不得超過7台；體育投注賠率則不得低於歐盤1.5倍或亞盤0.5盤口。若違反上述限制，平台有權取消或收回已發放的優惠點數。",
    "不得利用真人娛樂、電子遊藝、彩票等遊戲進行無風險對沖投注（例如同時買大小、單雙、紅黑，或在百家樂同時下莊家與閒家），對沖或對打的投注不列入有效投注計算，賽果為和局的注單也不予採計。經風控部門查核違規者，平台將回收優惠與贈點，情節嚴重者可能被凍結帳戶。",
    "同一玩家、同一住址、同一電子郵件、同一電話號碼或相同 IP 位址，僅能領取一次優惠；若查獲重複註冊或申請，平台保留取消優惠並扣回已領取點數的權利。",
    "本活動最終解釋權歸 WU88 所有，平台可在不另行通知的情況下修改或終止本優惠。",
  ],
};

export const PROMO_POPUPS: Record<"2on1" | "jumpvip" | "checkin", PromoPopupContent> = {
  "2on1": {
    bannerSlotId: "promo-popup-2on1-banner",
    name: "首存回饋二選一",
    period: "2025-08-01 起～暫定永久",
    audience: "全體新會員",
    sections: [
      {
        heading: "活動內容",
        paragraphs: [
          "方案一：新會員首次儲值贈送 100%，最高可領 1,000，本金加彩金需完成 5 倍流水後即可申請提款。",
          "方案二：新會員首次儲值滿 10,000，直接贈送 1,888，同樣需完成本金加彩金 5 倍流水後才可申請提款。",
          "兩個方案僅能擇一申請，且首次儲值金額須在 1,000 元（含）以上才符合資格。",
        ],
      },
      {
        heading: "注意事項",
        paragraphs: [
          "首次儲值後請於 24 小時內、且尚未下注前，主動聯繫線上客服申請首存優惠。",
          "僅計算會員的第一筆儲值金額；舊會員申辦新帳號不適用本活動。",
          "一旦開始下注，或申請超過 24 小時未處理，視同放棄本次優惠。",
        ],
      },
      WU88_TERMS_SECTION,
    ],
  },
  jumpvip: {
    bannerSlotId: "promo-popup-jumpvip-banner",
    name: "VIP特權跳槽計畫",
    period: "2025-07-24 起～暫定永久",
    audience: "全體會員",
    sections: [
      {
        heading: "活動內容",
        paragraphs: [
          "會員在本站儲值達 3,000（含）以上後，提供原平台近兩個月的累積有效投注量、或原平台的等級證明，即可聯繫客服申請等級轉移。",
          "轉移成功後，可依對應等級享有體育與其他遊戲類別的返水比例；達成對應儲值門檻後，還可申請一次性的跳槽彩金（每位會員限領一次，且不可跨等級請領）。",
          "申請時需以不間斷錄影方式，完整拍攝原平台的個人資料、綁定銀行、姓名、手機號碼、投注量與等級證明等資訊，且註冊資料須與原平台一致。",
        ],
      },
      {
        heading: "注意事項",
        paragraphs: [
          "跳槽彩金僅能對應轉移後的等級申請，且需完成一倍流水才可提款，不可與其他優惠同時申請。",
          "轉移後仍須每月達成對應的保級條件，未達標等級可能被調整。",
          "最終轉移與審核結果，皆以平台認定為準。",
        ],
      },
      WU88_TERMS_SECTION,
    ],
  },
  checkin: {
    bannerSlotId: "promo-popup-checkin-banner",
    name: "每日簽到贈投注彩點",
    period: "即日起～暫定永久",
    sections: [
      {
        heading: "活動內容",
        paragraphs: [
          "全平台會員只要當日有效投注達到 5,888 以上，即可領取 88 元簽到彩金；達到 68,888 以上則可再領取 188 元，兩項門檻每天最多各領一次。",
          "領取到的彩金只需完成一倍流水即可申請提款。",
        ],
      },
      {
        heading: "領取方式",
        paragraphs: [
          "電腦版：達成當日投注門檻後，點選右上角「會員中心」→「投注彩金」，即可看到可領取的按鈕並直接領取。",
          "手機版：點選「我」→「投注彩金」，達標項目會顯示黃色領取按鈕，點擊即可領取。",
        ],
      },
      {
        heading: "注意事項",
        paragraphs: [
          "請盡量在每日 23:45 前完成投注並申請領取；一到 00:00 就視為新的一天重新計算，先前未達標的部分不會補發。",
          "有效投注需等各遊戲館結算派彩後才會產生，系統更新約需 15 分鐘，建議提早完成投注與申請，避免來不及達標。",
        ],
      },
      WU88_TERMS_SECTION,
    ],
  },
};
