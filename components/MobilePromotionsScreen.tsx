"use client";

import { useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import { mobilePromotions, MOBILE_PROMO_CATEGORIES } from "@/data/mobilePromotions";
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

// 優惠 (promotions) list — its own standalone screen, replacing the normal
// MobileHeader/hero/category-explorer entirely, confirmed live against
// wu88.live/activity/:
//   - header: back arrow + centered "優惠" title (white 18px) on the
//     standard brand gradient (top-to-bottom, matches `bg-gradient-to-b
//     from-brand-from to-brand-to` — confirmed the gradient stops
//     rgb(255,138,63)→rgb(232,85,20) are exactly those tokens), star/收藏
//     icon pinned right (decorative in this demo, no real "my favorites"
//     list to wire it to).
//   - category filter row: white background, 7 tabs (全部/新會員/獨家優惠/
//     百家樂/電子場館/VIP特權/體育賽事), active tab is orange (#eb5e1a)
//     text with a 2px orange underline slider — confirmed via
//     getComputedStyle on the real `.v-tabs-slider`.
//   - list: full-width banner cards, ~16px side margin, 12px gap between
//     cards, 5px radius on the TOP corners only (confirmed live — real
//     site's cards are flat-bottomed, not fully rounded).
export default function MobilePromotionsScreen({ images }: Props) {
  const [category, setCategory] = useState<(typeof MOBILE_PROMO_CATEGORIES)[number]>("全部");

  const visible = mobilePromotions.filter((p) => category === "全部" || p.category === category);

  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");
  const favoriteIconSrc = pickImage(images, "mobile-promotions-favorite-icon");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <header className="flex-shrink-0 bg-gradient-to-b from-brand-from to-brand-to">
        <div className="flex h-[50px] items-center px-2 text-white">
          <Link href="/" aria-label="返回首頁" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
            {backArrowSrc ? (
              <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
            ) : (
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </Link>
          <h1 className="flex-1 text-center text-[18px]">優惠</h1>
          <button type="button" aria-label="收藏" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
            {favoriteIconSrc ? (
              <MaskIcon src={favoriteIconSrc} className="h-5 w-5 bg-white" />
            ) : (
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </button>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto bg-white px-3 pt-1">
          {MOBILE_PROMO_CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`flex-shrink-0 whitespace-nowrap border-b-2 pb-2 text-[14px] font-semibold ${
                  active ? "border-[#eb5e1a] text-[#eb5e1a]" : "border-transparent text-black"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-[#f5f5f5] px-[16px] py-[12px]">
        <div className="flex flex-col gap-[12px]">
          {visible.map((promo) => {
            const src = pickImage(images, promo.slotId);
            return (
              <Link
                key={promo.id}
                href={`/promotions/${promo.id}`}
                className="block overflow-hidden rounded-t-[5px] bg-white"
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={promo.title} className="aspect-[2.6/1] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[2.6/1] w-full items-center justify-center bg-gradient-to-br from-brand-from/50 to-brand-dark px-4 text-center text-sm font-bold text-white">
                    {promo.title}
                  </div>
                )}
              </Link>
            );
          })}

          {visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-black/40">此分類暫無活動</p>
          ) : null}
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
