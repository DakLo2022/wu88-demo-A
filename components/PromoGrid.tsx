"use client";

import { useState } from "react";
import { promoCards } from "@/data/promos";
import PromoPopupModal from "./PromoPopupModal";
import type { PROMO_POPUPS } from "@/data/promoPopups";

type Props = {
  images: Record<string, string | null>;
};

// Reverse-engineered against pc.wu88.live's real homepage: the cinema card
// (id "promo-1") pops a one-line "溫馨提醒" alert saying the cinema isn't
// activated yet. Three of the other four open a full activity-detail popup
// (URLs supplied by the user, from iframe-promotions.wu88.live) — mapped
// here by card id. The 5th (武財神線上商城, "promo-4") just opens the real
// mall site directly in a popup window.
const CINEMA_CARD_ID = "promo-1";
const POPUP_CARD_MAP: Record<string, keyof typeof PROMO_POPUPS> = {
  "promo-2": "jumpvip", // 你跳槽我出資 → jump_vip.html
  "promo-3": "2on1", // 首儲二選一怎麼選都賺 → 2on1.html
  "promo-5": "checkin", // 每日簽到活動 → betting_winnings.html
};
// 武財神線上商城 just opens the real mall site directly in a popup window,
// no in-site content to build.
const EXTERNAL_LINK_MAP: Record<string, string> = {
  "promo-4": "https://mall-app.wu88s.com/home",
};

// Grid of promo tiles. Section background is white to match the reference
// layout; each card keeps a fixed 233:180 aspect ratio (so it scales
// proportionally at any width) and shows its uploaded background image
// (bgSlotId) full-bleed, or falls back to a colored gradient. A small
// corner icon (iconSlotId) can optionally be layered on top. Card label is
// bold white text only, no subtitle line.
export default function PromoGrid({ images }: Props) {
  const [showCinemaReminder, setShowCinemaReminder] = useState(false);
  const [openPopup, setOpenPopup] = useState<keyof typeof PROMO_POPUPS | null>(null);

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-3 px-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
        {promoCards.map((card) => {
          const bgSrc = images[card.bgSlotId];
          const iconSrc = images[card.iconSlotId];
          const isCinema = card.id === CINEMA_CARD_ID;
          const popupVariant = POPUP_CARD_MAP[card.id];
          const externalLink = EXTERNAL_LINK_MAP[card.id];

          const handleClick = isCinema
            ? () => setShowCinemaReminder(true)
            : popupVariant
              ? () => setOpenPopup(popupVariant)
              : externalLink
                ? () => window.open(externalLink, "_blank", "width=1200,height=800,noopener,noreferrer")
                : undefined;

          return (
            <button
              key={card.id}
              type="button"
              onClick={handleClick}
              className={`group relative aspect-[233/180] w-full overflow-hidden rounded-lg text-left shadow-md transition hover:-translate-y-1 ${
                bgSrc ? "bg-brand-dark" : `bg-gradient-to-br ${card.accentClass}`
              }`}
            >
              {bgSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}

              {iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={iconSrc} alt="" className="absolute right-3 top-3 h-8 w-8 object-contain" />
              ) : (
                !bgSrc && (
                  <span className="absolute right-3 top-3 text-2xl opacity-70">{card.fallbackIcon}</span>
                )
              )}

              <div className="absolute inset-x-0 bottom-0 bg-black/50 px-3 py-2 text-center">
                <p className="text-sm font-bold text-white">{card.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {showCinemaReminder ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-[4px] bg-white shadow-xl">
            <p className="border-b border-black/10 px-5 py-3 text-center text-[15px] font-medium text-black">溫馨提醒</p>
            <p className="px-5 py-5 text-center text-[14px] text-black/70">您的影城尚未開啟,請儲值1000以激活觀看資格</p>
            <button
              onClick={() => setShowCinemaReminder(false)}
              className="w-full border-t border-black/10 py-3 text-[14px] text-[#1976d2] hover:bg-black/[0.02]"
            >
              確認
            </button>
          </div>
        </div>
      ) : null}

      <PromoPopupModal variant={openPopup} images={images} onClose={() => setOpenPopup(null)} />
    </div>
  );
}
