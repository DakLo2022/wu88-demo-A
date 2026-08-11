"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";
import { MOBILE_TAB_ITEMS, MOBILE_TAB_CENTER_ID, mobileTabIconSlotId } from "@/lib/imageSlots";

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
          className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-white shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_0_3px_var(--brand-accent)]"
          aria-label="存提"
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
    </nav>
  );
}
