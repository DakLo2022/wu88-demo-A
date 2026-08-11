"use client";

import { useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import MobileBottomNav from "./MobileBottomNav";
import MobileServiceChatModal from "./MobileServiceChatModal";

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

// Fallback icons (used until something's uploaded for the 3 slots below) —
// simple generic glyphs in roughly the same colors as the real site's own
// icons (chat bubble blue, LINE green, envelope orange), not a copy of the
// live site's actual artwork.
function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#2f9bda">
      <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4V4z" />
    </svg>
  );
}
function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#06c755">
      <path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3 0 .7 0 1l-.1.9c0 .3-.2 1 .9.6 1.1-.4 5.9-3.5 8-6C21.3 13.7 22 12.4 22 11c0-4.4-4.5-8-10-8z" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#eb5e1a">
      <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.4 2 7.6 6.2L19.6 7H4.4zM4 8.4V18h16V8.4l-8 6.5-8-6.5z" />
    </svg>
  );
}

// 客服中心 page — reached from 服務 page's 武財神真人客服 card. Confirmed
// live against wu88.live/client/: header (back arrow + centered "客服中心"
// title) + a decorative top banner (the real site's own mascot artwork,
// not reproduced — its own upload slot with a plain fallback instead) + 3
// full-width rounded rows (在線客服/Line客服/電子信箱), each a white
// 10px-radius card with a 24px icon + label, confirmed live (x=15, w=384,
// h=45, 16px gap between rows).
//
// Per-row behavior, per explicit request (not all 3 mirror the live site):
//   - 在線客服: opens a fake local chat window (MobileServiceChatModal) —
//     this demo has no real live-agent backend to connect to.
//   - Line客服: opens the real LINE add-friend link in a new tab.
//   - 電子信箱: rendered at 50% opacity — no real email flow behind it.
export default function MobileServiceClientScreen({ images }: Props) {
  const [showChat, setShowChat] = useState(false);

  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");
  const bannerSrc = pickImage(images, "mobile-service-client-banner");
  const onlineIconSrc = pickImage(images, "mobile-service-icon-online");
  const lineIconSrc = pickImage(images, "mobile-service-icon-line");
  const emailIconSrc = pickImage(images, "mobile-service-icon-email");
  const backgroundSrc = pickImage(images, "mobile-service-client-background");

  const rowClass =
    "flex h-[45px] w-full items-center gap-3 rounded-[10px] bg-white px-4 text-[16px] font-medium text-black/[0.87] shadow-[0_3px_7px_rgba(0,0,0,0.03)]";

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <header className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-b from-brand-from to-brand-to px-2 text-white">
        <Link href="/service" aria-label="返回服務" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {backArrowSrc ? (
            <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </Link>
        <h1 className="flex-1 text-center text-[18px]">客服中心</h1>
        <span className="w-8 flex-shrink-0" aria-hidden />
      </header>

      <div
        className="flex-1 overflow-y-auto bg-[#f0eff5] bg-cover bg-center bg-no-repeat px-[15px] pt-[15px]"
        style={backgroundSrc ? { backgroundImage: `url(${backgroundSrc})` } : undefined}
      >
        <div className="mb-6 flex w-full items-center justify-center overflow-hidden rounded-[8px]">
          {bannerSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerSrc} alt="24hr 真人客服" className="w-full object-contain" />
          ) : (
            <div className="flex aspect-[7/4] w-full items-center justify-center rounded-[8px] bg-gradient-to-br from-brand-from/60 to-brand-dark text-center text-lg font-bold text-white">
              24hr 真人客服
            </div>
          )}
        </div>

        <button type="button" onClick={() => setShowChat(true)} className={`${rowClass} mb-4`}>
          {onlineIconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={onlineIconSrc} alt="" className="h-6 w-6 object-contain" />
          ) : (
            <ChatBubbleIcon />
          )}
          在線客服
        </button>

        <a
          href="https://line.me/R/ti/p/@979vyqkf?ts=04262040&oat_content=url"
          target="_blank"
          rel="noopener noreferrer"
          className={`${rowClass} mb-4`}
        >
          {lineIconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lineIconSrc} alt="" className="h-6 w-6 object-contain" />
          ) : (
            <LineIcon />
          )}
          Line客服
        </a>

        <button type="button" disabled aria-disabled className={`${rowClass} mb-4 opacity-50`}>
          {emailIconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={emailIconSrc} alt="" className="h-6 w-6 object-contain" />
          ) : (
            <EmailIcon />
          )}
          電子信箱
        </button>
      </div>

      {showChat ? <MobileServiceChatModal onClose={() => setShowChat(false)} /> : null}

      <MobileBottomNav images={images} />
    </div>
  );
}
