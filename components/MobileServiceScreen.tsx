"use client";

import { useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import MobileBottomNav from "./MobileBottomNav";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

function MaskIcon({ src, className }: { src: string; className: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

// Confirmed live on wu88.live/wservice: clicking the still-unopened 線上影城
// banner shows a SweetAlert2-style popup — white rounded box, orange
// (#eb5e1a) title bar "提醒您", gray 18px message, single "關閉" button with
// a thin black border. Reproduced as a plain fixed-overlay component here
// (not a real swal2 dependency) since it's only ever used for this one spot.
function ReminderModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-[280px] overflow-hidden rounded-[5px] bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#eb5e1a] py-2 text-center text-[20px] font-bold text-white">提醒您</div>
        <div className="px-4 py-4 text-center text-[16px] leading-relaxed text-[#545454]">
          您的影城尚未開啟，請儲值1000以激活觀看資格
        </div>
        <div className="flex justify-center pb-4">
          <button
            type="button"
            onClick={onClose}
            className="h-6 rounded-[5px] border border-black px-[15px] text-[16px] font-medium text-[#333]"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}

type ServiceCard = {
  slotId: string;
  fallbackTitle: string;
};

const CARDS: ServiceCard[] = [
  { slotId: "mobile-service-banner-1", fallbackTitle: "武財神線上影城" },
  { slotId: "mobile-service-banner-2", fallbackTitle: "武財神真人客服" },
  { slotId: "mobile-service-banner-3", fallbackTitle: "武財神線上商城" },
];

// 服務 (service) page — reached from the bottom tab bar's 服務 button.
// Confirmed live against wu88.live/wservice: header (back arrow + centered
// "服務" title, no right-side button) + a full-bleed background image behind
// the card list (confirmed live: `.activity_promotions`'s own
// background-image, cover/center/no-repeat — its own upload slot, falls
// back to the flat #f0eff5 the real site also shows underneath it) + 3
// stacked full-width banner cards (18.5px side margin, 16px gap, 5px radius
// on TOP corners only, no shadow — same card treatment as the 優惠 list
// page). Each banner's own
// artwork features the site's tiger/animal mascot characters, which is the
// live site's own copyrighted art, so it isn't reproduced here — each
// banner is its own upload slot with a plain brand-gradient + title
// fallback, same pattern as every other banner slot in this project.
// Per-card behavior, all confirmed live:
//   - 武財神線上影城 (card 1): the real site's cinema isn't open yet, so
//     clicking it shows a "提醒您" reminder popup rather than going
//     anywhere — reproduced as ReminderModal above.
//   - 武財神真人客服 (card 2): goes to the 客服中心 page (/service/client).
//   - 武財神線上商城 (card 3): opens the real mall
//     (https://mall-app.wu88s.com/home) in a new tab — confirmed live by
//     patching window.open before clicking the real card.
export default function MobileServiceScreen({ images }: Props) {
  const [showReminder, setShowReminder] = useState(false);
  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");
  const backgroundSrc = pickImage(images, "mobile-service-background");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <header className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-b from-brand-from to-brand-to px-2 text-white">
        <Link href="/" aria-label="返回首頁" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {backArrowSrc ? (
            <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </Link>
        <h1 className="flex-1 text-center text-[18px]">服務</h1>
        <span className="w-8 flex-shrink-0" aria-hidden />
      </header>

      <div
        className="flex flex-1 flex-col gap-[12px] overflow-y-auto bg-[#f0eff5] bg-cover bg-center bg-no-repeat px-[16.5px] pt-[20px] pb-[18px]"
        style={backgroundSrc ? { backgroundImage: `url(${backgroundSrc})` } : undefined}
      >
        {CARDS.map((card, index) => {
          const src = pickImage(images, card.slotId);
          // Confirmed live: each card sits inside its own outer wrapper
          // (`.activity_promotions_list`) — a 2px solid black border, 10px
          // radius, and a hard drop shadow (`0 2px 2px 2px rgba(0,0,0,.75)`)
          // — separate from the image itself, which is inset 2px inside
          // that border. Border-box sizing means the aspect ratio below
          // (measured on the outer wrapper, not the inner image) still
          // fills correctly with the border included.
          const cardClassName =
            "block aspect-[380.9/133.3] w-full overflow-hidden rounded-[10px] border-2 border-black bg-white text-left shadow-[0_2px_2px_2px_rgba(0,0,0,0.75)]";
          const content = src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={card.fallbackTitle} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-from/60 to-brand-dark px-4 text-center text-base font-bold text-white">
              {card.fallbackTitle}
            </div>
          );

          if (index === 0) {
            return (
              <button key={card.slotId} type="button" onClick={() => setShowReminder(true)} className={cardClassName}>
                {content}
              </button>
            );
          }
          if (index === 1) {
            return (
              <Link key={card.slotId} href="/service/client" className={cardClassName}>
                {content}
              </Link>
            );
          }
          return (
            <a
              key={card.slotId}
              href="https://mall-app.wu88s.com/home"
              target="_blank"
              rel="noopener noreferrer"
              className={cardClassName}
            >
              {content}
            </a>
          );
        })}
      </div>

      {showReminder ? <ReminderModal onClose={() => setShowReminder(false)} /> : null}

      <MobileBottomNav images={images} />
    </div>
  );
}
