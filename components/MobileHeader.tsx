"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";
import { useLoggedIn } from "@/lib/useLoggedIn";
import MobileWalletPanel from "./MobileWalletPanel";

type Props = {
  images: Record<string, string | null>;
};

// Mobile-only header: gradient bar (same colors as desktop TopBar), logo on
// the left. Two states, both confirmed live against wu88.live:
//   - logged out: simple "登入/註冊" text link → /login (MobileAuthCard.tsx).
//   - logged in: username (white, 14px, 700) + a white "VIP1 銅" pill badge
//     (black text, 3px radius) + balance number (white, 14px, 700) + a
//     round down-arrow icon button that opens the full-screen wallet list
//     (MobileWalletPanel.tsx) + a message-center bell icon — all measured
//     via getComputedStyle/getBoundingClientRect against the real
//     `.home_header` while signed in, not guessed from the desktop TopBar's
//     very different logged-in layout.
// This demo has no real backend/session, so `loggedIn` is persisted to
// localStorage via useLoggedIn() (same "fake auth" convention as the
// desktop TopBar's own `loggedIn` state, just shared across pages now —
// see lib/useLoggedIn.ts for why) — MobileAuthCard's fake login/register
// redirects back here with `?loggedIn=1` so the state is actually reachable
// by using the site, not just a hidden toggle.
export default function MobileHeader({ images }: Props) {
  const searchParams = useSearchParams();
  const [loggedIn, setLoggedIn] = useLoggedIn();
  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    if (searchParams.get("loggedIn") === "1") setLoggedIn(true);
  }, [searchParams]);

  // Prefer a mobile-specific logo (uploaded via the "手機" tab in
  // /image-manager) if one exists, otherwise fall back to the desktop logo.
  const logoSrc = images[mobileSlotKey("logo")] ?? images["logo"];
  const mailIconSrc = images[mobileSlotKey("topbar-mail-icon")] ?? images["topbar-mail-icon"];
  const walletArrowSrc =
    images[mobileSlotKey("mobile-header-wallet-arrow")] ?? images["mobile-header-wallet-arrow"];

  return (
    <header className="relative flex h-14 flex-shrink-0 items-center justify-between bg-gradient-to-b from-brand-from to-brand-to px-3">
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="Logo" className="h-8 w-auto max-w-[120px] object-contain" />
      ) : (
        <span className="text-lg font-extrabold text-white">LOGO</span>
      )}

      {loggedIn ? (
        // Single row, left to right — confirmed live via getBoundingClientRect
        // (帳號/VIP徽章/金額/箭頭/訊息 all share the same y-range on the real
        // site, not stacked): 帳號 → VIP徽章 → 金額 → 錢包箭頭 → 消息中心.
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-bold text-white">會員001</span>
          <span className="rounded-[3px] bg-white px-[5px] text-[11px] text-black">VIP1 銅</span>
          <span className="text-[14px] font-bold text-white">299</span>

          <button
            type="button"
            onClick={() => setShowWallet(true)}
            aria-label="錢包選單"
            className="flex h-6 w-6 items-center justify-center rounded-full text-white"
          >
            {walletArrowSrc ? (
              <span
                aria-hidden
                className="block h-4 w-4 bg-white"
                style={{
                  WebkitMaskImage: `url(${walletArrowSrc})`,
                  maskImage: `url(${walletArrowSrc})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
            ) : (
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            )}
          </button>

          <button type="button" aria-label="消息中心" className="flex h-6 w-6 items-center justify-center">
            {mailIconSrc ? (
              // CSS-mask recolor (same trick as the wallet arrow above and
              // desktop TopBar's MaskIcon) so the uploaded SVG always renders
              // solid white here regardless of whatever fill color is baked
              // into the file itself.
              <span
                aria-hidden
                className="block h-5 w-5 bg-white"
                style={{
                  WebkitMaskImage: `url(${mailIconSrc})`,
                  maskImage: `url(${mailIconSrc})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
            ) : (
              <span className="text-lg leading-none">🔔</span>
            )}
          </button>
        </div>
      ) : (
        <Link href="/login" className="text-[13px] font-medium text-white" aria-label="登入或註冊">
          登入/註冊
        </Link>
      )}

      <MobileWalletPanel
        open={showWallet}
        onClose={() => setShowWallet(false)}
        mainBalance={299}
        images={images}
      />
    </header>
  );
}
