"use client";

import { useState } from "react";
import { navCategories } from "@/data/nav";
import {
  navProviderSlotId,
  navBadgeSlotId,
  mobileCatIconSlotId,
  mobileCatIconActiveSlotId,
  GLOBAL_PROVIDER_SLOT_ID,
  GLOBAL_PROVIDER_BADGE_SLOT_ID,
} from "@/lib/imageSlots";
import {
  mobileSlotKey,
  getImageTransformStyle,
  DEFAULT_IMAGE_TRANSFORM,
  type ImageTransform,
} from "@/lib/imageTransform";

// Looks up a slot's image, preferring whichever was actually uploaded: the
// mobile-specific one (stored under the "__mobile" key when uploaded via the
// "手機" tab in /image-manager) or the plain/desktop one. Every image on
// this mobile-only screen goes through this so an upload "does nothing"
// isn't possible just because it landed in the other of the two buckets.
function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

type Props = {
  images: Record<string, string | null>;
  positions: Record<string, ImageTransform>;
};

const RAIL_ICONS: Record<string, string> = {
  hot: "🔥",
  slots: "🎰",
  sports: "⚽",
  live: "🎲",
  lottery: "🎱",
  cards: "🀄",
  fishing: "🐟",
  esports: "🎮",
};

// Mobile-only "left rail + vendor grid" explorer — this is the mobile
// equivalent of the desktop Navbar's hover dropdown: tap a category on the
// left, its provider list fills the scrollable grid on the right. Both
// panes scroll independently and together fill the remaining viewport
// height between the hero banner and the fixed bottom nav.
export default function MobileCategoryExplorer({ images, positions }: Props) {
  const [activeKey, setActiveKey] = useState(navCategories[0]?.key ?? "");
  const activeCategory = navCategories.find((c) => c.key === activeKey) ?? navCategories[0];
  const columns = activeCategory?.mobileColumns ?? 2;
  const isTall = activeCategory?.mobileCardHeight === "tall";

  return (
    <div className="flex flex-1 overflow-hidden bg-white">
      {/* Left rail */}
      <div className="no-scrollbar flex w-16 flex-shrink-0 flex-col gap-2 overflow-y-auto bg-white px-1.5 py-2">
        {navCategories.map((cat) => {
          const active = cat.key === activeCategory?.key;
          const iconSrc = active
            ? pickImage(images, mobileCatIconActiveSlotId(cat.key)) ?? pickImage(images, mobileCatIconSlotId(cat.key))
            : pickImage(images, mobileCatIconSlotId(cat.key));
          return (
            <button
              key={cat.key}
              onClick={() => setActiveKey(cat.key)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 bg-[#ffecdc] px-1 py-2.5 text-[11px] transition-colors ${
                active
                  ? "border-red-500 font-semibold text-brand-accent"
                  : "border-transparent text-neutral-600"
              }`}
            >
              {iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconSrc}
                  alt=""
                  className={`object-contain transition-all ${
                    active ? "h-[35px] w-[35px]" : "h-[25px] w-[25px]"
                  }`}
                />
              ) : (
                <span className={`leading-none transition-all ${active ? "text-[35px]" : "text-[25px]"}`}>
                  {cat.icon ?? RAIL_ICONS[cat.key] ?? "🎮"}
                </span>
              )}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Vendor/provider grid for the active category. Column count + card
          height are per-category (see mobileColumns/mobileCardHeight on
          NavCategory) — sampled from wu88.live, where 彩球 stays 2 columns
          but grows taller, and 棋牌/捕魚/電競 drop to a single full-width
          column (棋牌 at the standard height, 捕魚/電競 at the tall one). */}
      <div
        className={`no-scrollbar grid flex-1 auto-rows-min gap-2 overflow-y-auto p-2 ${
          columns === 1 ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {activeCategory?.providers.map((name, idx) => {
          const slotId = navProviderSlotId(activeCategory.key, idx);
          const badgeSlotId = navBadgeSlotId(activeCategory.key, idx);
          const src = pickImage(images, slotId);
          const badgeSrc = pickImage(images, badgeSlotId);

          // Precedence: this provider's own saved mobile position > its own
          // saved desktop position > the "廠商圖片統一版面設定" global mobile
          // default > the global desktop default > (nothing saved anywhere)
          // fixed top-center crop. Real card boxes measured off wu88.live are
          // quite wide relative to typical portrait character art (e.g. 棋牌
          // is 320x192 for a single-column card) — cover-fitting a tall image
          // into a wide box crops the top/bottom, not the sides, so anchoring
          // to "bottom" (the original default) was cutting off faces/heads;
          // "top" keeps them in frame. Any image can still be repositioned
          // individually or via the global panel in /image-manager.
          const savedTransform =
            positions[mobileSlotKey(slotId)] ??
            positions[slotId] ??
            positions[mobileSlotKey(GLOBAL_PROVIDER_SLOT_ID)] ??
            positions[GLOBAL_PROVIDER_SLOT_ID];
          const hasCustomPosition = Boolean(savedTransform);

          // Same precedence chain, for the top-right corner logo badge.
          const savedBadgeTransform =
            positions[mobileSlotKey(badgeSlotId)] ??
            positions[badgeSlotId] ??
            positions[mobileSlotKey(GLOBAL_PROVIDER_BADGE_SLOT_ID)] ??
            positions[GLOBAL_PROVIDER_BADGE_SLOT_ID];

          return (
            <div
              key={slotId}
              className={`relative overflow-hidden rounded-lg bg-[#ffecdc] ${
                columns === 1 ? "w-full" : "w-[156.8px]"
              } ${isTall ? "h-[288px]" : "h-[192px]"}`}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={
                    hasCustomPosition
                      ? getImageTransformStyle(savedTransform ?? DEFAULT_IMAGE_TRANSFORM)
                      : { objectPosition: "top" }
                  }
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-3xl text-neutral-300">
                  🎮
                </div>
              )}

              {/* Top-left: plain-text game name chip, flush against the
                  card's own top-left corner (no inset) — rounded only on
                  its top-left and bottom-right corners, light gray fill,
                  drop shadow, black text, 10px text with 12px of padding on
                  all sides. Top-right: uploaded vendor logo badge (no
                  background box, matches the real site's own
                  logo-on-transparent rendering), inset by a small margin. */}
              <span className="absolute left-0 top-0 z-10 max-w-[70%] truncate rounded-tl-[8px] rounded-br-[8px] bg-[#efefef] px-3 py-2 text-[12px] font-semibold leading-tight text-black shadow-md">
                {name}
              </span>
              {badgeSrc ? (
                // Fixed-size box (not just a bare <img>) so the drag/scale
                // transform below has a consistent frame of reference —
                // same reasoning as the main art image above.
                <div className="absolute right-1 top-1 z-10 h-[45px] w-[56px] overflow-visible">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={badgeSrc}
                    alt=""
                    className="h-full w-full object-contain"
                    style={
                      savedBadgeTransform ? getImageTransformStyle(savedBadgeTransform) : undefined
                    }
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
