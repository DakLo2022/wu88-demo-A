"use client";

import { PROMO_POPUPS } from "@/data/promoPopups";

type Props = {
  variant: keyof typeof PROMO_POPUPS | null;
  images: Record<string, string | null>;
  onClose: () => void;
};

// Full activity-detail popup for the promo-grid cards that actually open one
// on the real site (首儲二選一/你跳槽我出資/每日簽到活動 — the other two cards,
// 武財神線上影城 and 武財神線上商城, are handled separately: the cinema card
// shows a one-line reminder alert, and the mall card has no confirmed
// destination). Structure mirrors the real iframe-promotions pages: a
// full-width banner, then 活動名稱/活動時間/活動對象 + numbered content
// sections, ending in the same WU88 terms block used elsewhere.
export default function PromoPopupModal({ variant, images, onClose }: Props) {
  if (!variant) return null;
  const content = PROMO_POPUPS[variant];
  const bannerSrc = images[content.bannerSlotId];

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div className="w-full max-w-[760px] rounded-[6px] bg-white shadow-xl">
        <div className="relative">
          {bannerSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerSrc} alt={content.name} className="w-full rounded-t-[6px] object-cover" />
          ) : (
            <div className="flex h-[220px] w-full items-center justify-center rounded-t-[6px] bg-black/5 text-[12px] text-black/40">
              {content.name} Banner
            </div>
          )}
          <button
            onClick={onClose}
            aria-label="關閉"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-6 sm:px-8">
          <div>
            <p className="mb-3 border-l-4 border-[#eb5e1a] pl-2 text-[16px] font-medium text-black">活動名稱</p>
            <p className="text-[14px] text-black/70">{content.name}</p>
          </div>
          <div>
            <p className="mb-3 border-l-4 border-[#eb5e1a] pl-2 text-[16px] font-medium text-black">活動時間</p>
            <p className="text-[14px] text-black/70">{content.period}</p>
          </div>
          {content.audience ? (
            <div>
              <p className="mb-3 border-l-4 border-[#eb5e1a] pl-2 text-[16px] font-medium text-black">活動對象</p>
              <p className="text-[14px] text-black/70">{content.audience}</p>
            </div>
          ) : null}

          {content.sections.map((section) => (
            <div key={section.heading}>
              <p className="mb-3 border-l-4 border-[#eb5e1a] pl-2 text-[16px] font-medium text-black">{section.heading}</p>
              <div className="flex flex-col gap-2 text-[13px] text-black/70">
                {section.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
