"use client";

import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";

type Props = {
  title: string;
  images: Record<string, string | null>;
  /** Defaults to /my — pass a different route for pages nested another
   * level deep (e.g. the 安全中心 sub-forms go back to /my/security, not
   * /my). */
  backHref?: string;
  /** Optional right-aligned slot (e.g. none of the current pages need one,
   * but kept for parity with the header pattern used elsewhere in this
   * project). */
  right?: React.ReactNode;
};

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

// Shared header for every 我的-page second-layer screen (綁定帳戶/投注彩金/
// 邀請好友/安全中心 + all 帳戶明細/會員資料/協助中心 sub-pages): back arrow +
// centered title on the standard brand gradient, same pattern already used
// by MobileMyScreen/MobileTradeScreen/MobileServiceScreen. None of these
// second-layer pages render <MobileBottomNav> — that's an explicit,
// deliberate omission on every page that uses this header.
export default function MobileSubPageHeader({ title, images, backHref = "/my", right }: Props) {
  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");
  return (
    <header className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-b from-brand-from to-brand-to px-2 text-white">
      <Link href={backHref} aria-label="返回" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
        {backArrowSrc ? (
          <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </Link>
      <h1 className="flex-1 text-center text-[18px]">{title}</h1>
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center">{right}</span>
    </header>
  );
}
