"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";
import { MOBILE_TAB_ITEMS, MOBILE_TAB_CENTER_ID, mobileTabIconSlotId } from "@/lib/imageSlots";
import { useLoggedIn } from "@/lib/useLoggedIn";
import LoginRequiredModal from "./LoginRequiredModal";

type Props = {
  images: Record<string, string | null>;
};

// Route each linkable tab goes to, so the active-state check below and the
// href are driven by the same table instead of two places that could drift.
const TAB_HREF: Record<string, string> = {
  billing: "/trade",
  service: "/service",
  member: "/my",
};

// Confirmed live on wu88.live (logged out, in a fresh tab that lost its
// session): tapping 帳務, 存提, or 我的 while signed out never navigates —
// it pops a SweetAlert2 "提醒您 / 請先登入" alert instead (see
// LoginRequiredModal.tsx), and only sends the visitor to /user-login once
// they tap 關閉. 優惠/首頁/服務 are NOT gated this way — confirmed live
// those stay reachable while signed out.
const GATED_TAB_IDS = new Set(["billing", "member"]);

// Looks up a slot's image, preferring whichever was actually uploaded: the
// mobile-specific one (uploaded via the "手機" tab in /image-manager) or the
// plain/desktop one.
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

const PROMO_TAB = MOBILE_TAB_ITEMS[0];
const TABS_MIDDLE_LEFT = MOBILE_TAB_ITEMS.slice(1, 2);
const TABS_RIGHT = MOBILE_TAB_ITEMS.slice(2);

// The 3 options that pop up above the bottom nav when 存提 is tapped —
// confirmed live on wu88.live: tapping the center 存提 button opens a
// v-dialog holding exactly these 3 buttons (轉點→/transfer, 儲值→/deposit,
// 託售→/withdrawal), each a 90×54 pill with a pink→maroon... no — confirmed
// via getComputedStyle this is an ORANGE gradient
// linear-gradient(#f87a19,#f84c00) (NOT the login/wallet buttons' pink one),
// 10px radius, white 36×31 icon over an 11px white label, evenly spaced
// inside a translucent white card (bg rgba(255,255,255,.7), 1px
// #e1e2e2 border, 10px radius) that floats just above the nav.
const DW_MENU_ITEMS = [
  { label: "轉點", href: "/transfer", iconSlot: "mobile-dw-menu-icon-transfer", fallbackEmoji: "💱" },
  { label: "儲值", href: "/deposit", iconSlot: "mobile-dw-menu-icon-deposit", fallbackEmoji: "⬇️" },
  { label: "託售", href: "/withdrawal", iconSlot: "mobile-dw-menu-icon-withdrawal", fallbackEmoji: "⬆️" },
] as const;

// Fixed mobile bottom tab bar — same gradient as the TopBar, with a raised
// circular logo button ("存提") floating above the center, matching
// wu88.live's app-shell footer. All 5 columns (2 left + center + 2 right)
// share the exact same `flex-col justify-end pb-2` structure so every
// label sits on the same baseline — the center button is absolutely
// positioned so it can float above the bar, but its label is a normal flow
// child of the same bottom-anchored column as the other four, instead of
// being pinned separately, which is what caused it to sit off-baseline.
export default function MobileBottomNav({ images }: Props) {
  const pathname = usePathname();
  const [loggedIn] = useLoggedIn();
  const [showDwMenu, setShowDwMenu] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  // The real site uses live Vue-router `router-link-active` classes to
  // decide both of these — reproduced here with usePathname() instead of a
  // prop, so every page automatically gets the right state just by being at
  // the right URL, rather than every caller having to remember to pass a
  // flag (this is exactly the bug class the promo/home swap almost repeated
  // when adding a second page that needed it — see MobileTradeScreen).
  const isHome = pathname === "/";

  // Dedicated "存提" icon if uploaded; otherwise fall back to the site logo
  // (the button's original placeholder before it had its own upload slot).
  const centerIconSrc =
    pickImage(images, mobileTabIconSlotId(MOBILE_TAB_CENTER_ID)) ??
    images[mobileSlotKey("logo")] ??
    images["logo"];

  const promoIconSrc = pickImage(images, mobileTabIconSlotId(PROMO_TAB.id));
  const homeIconSrc = pickImage(images, mobileTabIconSlotId("home"));

  // Confirmed live on wu88.live/trade: the currently-active tab (matched via
  // the real site's router-link-active class) turns its label AND icon a
  // gold/yellow rgb(250,238,0) — the real site also swaps in a distinct
  // "_on" badge-style icon graphic there, but that specific artwork is the
  // live site's own copyrighted asset, so it isn't reproduced here; the
  // uploaded icon is recolored gold instead of white, which carries the
  // same "this tab is active" signal within what this project's
  // upload-your-own-icon system can express.
  const activeIconClass = "h-[26px] w-[26px] bg-[#faee00]";
  const inactiveIconClass = "h-[26px] w-[26px] bg-white";
  const activeLabelClass = "text-[11px] leading-none text-[#faee00]";
  const inactiveLabelClass = "text-[11px] leading-none text-white";

  function renderTab(tab: (typeof MOBILE_TAB_ITEMS)[number]) {
    const iconSrc = pickImage(images, mobileTabIconSlotId(tab.id));
    const href = TAB_HREF[tab.id];
    const active = href ? pathname.startsWith(href) : false;
    const content = (
      <>
        {iconSrc ? (
          // Recolored via CSS mask (so it stays legible on the orange bar
          // regardless of the color baked into the uploaded file), same
          // technique used for TopBar's icons — white normally, gold when
          // this tab's route is the current page.
          <MaskIcon src={iconSrc} className={active ? activeIconClass : inactiveIconClass} />
        ) : (
          <span className="text-2xl leading-none">{tab.fallbackEmoji}</span>
        )}
        <span className={active ? activeLabelClass : inactiveLabelClass}>{tab.label}</span>
      </>
    );

    if (href && GATED_TAB_IDS.has(tab.id) && !loggedIn) {
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => setShowLoginRequired(true)}
          className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-2"
        >
          {content}
        </button>
      );
    }

    if (href) {
      return (
        <Link key={tab.id} href={href} className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-2">
          {content}
        </Link>
      );
    }

    // No page built yet for this tab — keep it a non-navigating button
    // rather than linking somewhere that 404s.
    return (
      <button key={tab.id} className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-2 text-white">
        {content}
      </button>
    );
  }

  return (
    <nav className="relative flex h-14 flex-shrink-0 items-stretch justify-around bg-gradient-to-t from-brand-to to-brand-from px-2">
      {/* First column: 優惠 ↔ 首頁 swap, driven by pathname (== "/" or not)
          instead of a prop — confirmed live this isn't specific to the
          promotions page: ANY non-home page (e.g. /trade) shows 首頁 here,
          only the home page itself shows 優惠. */}
      <Link
        href={isHome ? "/promotions" : "/"}
        className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-2 text-white"
      >
        {isHome ? (
          promoIconSrc ? (
            <MaskIcon src={promoIconSrc} className="h-[26px] w-[26px] bg-white" />
          ) : (
            <span className="text-2xl leading-none">{PROMO_TAB.fallbackEmoji}</span>
          )
        ) : homeIconSrc ? (
          <MaskIcon src={homeIconSrc} className="h-[26px] w-[26px] bg-white" />
        ) : (
          <span className="text-2xl leading-none">🏠</span>
        )}
        <span className="text-[11px] leading-none">{isHome ? PROMO_TAB.label : "首頁"}</span>
      </Link>

      {TABS_MIDDLE_LEFT.map(renderTab)}

      {/* Center column: floating circle raised above the bar, its label
          anchored to the same pb-2 baseline as the other four columns. */}
      <div className="relative flex flex-1 flex-col items-center justify-end gap-0.5 pb-2">
        <button
          type="button"
          onClick={() => (loggedIn ? setShowDwMenu((v) => !v) : setShowLoginRequired(true))}
          className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-white shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_0_3px_var(--brand-accent)]"
          aria-label="存提"
          aria-expanded={showDwMenu}
        >
          {centerIconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={centerIconSrc} alt="" className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <span className="text-3xl">💰</span>
          )}
        </button>
        <span className="text-[10px] leading-none text-white">存提</span>
      </div>

      {TABS_RIGHT.map(renderTab)}

      {showDwMenu ? (
        <>
          {/* Re-checked live: the real site DOES dim the page behind this
              popup — a Vuetify `.v-overlay__scrim`, confirmed via
              getComputedStyle at rgb(33,33,33) / opacity 0.46 — an earlier
              pass here missed it (screenshot JPEG at tiny size made the dim
              layer hard to see) and wrongly built this as an invisible
              tap-to-close layer. */}
          <button
            type="button"
            aria-label="關閉存提選單"
            onClick={() => setShowDwMenu(false)}
            className="fixed inset-0 z-[89] cursor-default bg-[#212121]/45"
          />
          <div className="absolute bottom-full left-1/2 z-[90] mb-2 w-[calc(100%-20px)] max-w-[382px] -translate-x-1/2 rounded-[10px] border border-[#e1e2e2] bg-white/70 px-2 py-0 backdrop-blur-sm">
            <div className="flex items-center justify-around">
              {DW_MENU_ITEMS.map((item) => {
                const iconSrc = pickImage(images, item.iconSlot);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setShowDwMenu(false)}
                    className="my-[9.5px] flex h-[54px] w-[90px] flex-row items-center justify-center gap-1 rounded-[10px] bg-gradient-to-b from-[#f87a19] to-[#f84c00] text-white"
                  >
                    {/* Re-checked live: the real button lays out icon LEFT
                        of label (flex-row, both vertically centered), not
                        icon-above-label like an earlier pass here built —
                        confirmed via each element's own getBoundingClientRect:
                        icon x 175–211, label x 216–238, same vertical
                        center. */}
                    {iconSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={iconSrc} alt="" className="h-[24px] w-[28px] object-contain" />
                    ) : (
                      <span className="text-xl leading-none">{item.fallbackEmoji}</span>
                    )}
                    <span className="text-[11px] leading-none text-white">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      {showLoginRequired ? <LoginRequiredModal onClose={() => setShowLoginRequired(false)} /> : null}
    </nav>
  );
}
