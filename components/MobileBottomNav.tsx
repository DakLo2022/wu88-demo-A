import { mobileSlotKey } from "@/lib/imageTransform";
import { MOBILE_TAB_ITEMS, MOBILE_TAB_CENTER_ID, mobileTabIconSlotId } from "@/lib/imageSlots";

type Props = {
  images: Record<string, string | null>;
};

// Looks up a slot's image, preferring whichever was actually uploaded: the
// mobile-specific one (uploaded via the "手機" tab in /image-manager) or the
// plain/desktop one.
function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

const TABS = MOBILE_TAB_ITEMS.slice(0, 2);
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
  // Dedicated "存提" icon if uploaded; otherwise fall back to the site logo
  // (the button's original placeholder before it had its own upload slot).
  const centerIconSrc =
    pickImage(images, mobileTabIconSlotId(MOBILE_TAB_CENTER_ID)) ??
    images[mobileSlotKey("logo")] ??
    images["logo"];

  return (
    <nav className="relative flex h-14 flex-shrink-0 items-stretch justify-around bg-gradient-to-t from-brand-to to-brand-from px-2">
      {TABS.map((tab) => {
        const iconSrc = pickImage(images, mobileTabIconSlotId(tab.id));
        return (
          <button
            key={tab.id}
            className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-2 text-white"
          >
            {iconSrc ? (
              // Recolored white via CSS mask (so it stays legible on the
              // orange bar regardless of the color baked into the uploaded
              // file), same technique used for TopBar's icons.
              <span
                aria-hidden
                className="h-[26px] w-[26px] bg-white"
                style={{
                  WebkitMaskImage: `url(${iconSrc})`,
                  maskImage: `url(${iconSrc})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
            ) : (
              <span className="text-2xl leading-none">{tab.fallbackEmoji}</span>
            )}
            <span className="text-[11px] leading-none">{tab.label}</span>
          </button>
        );
      })}

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

      {TABS_RIGHT.map((tab) => {
        const iconSrc = pickImage(images, mobileTabIconSlotId(tab.id));
        return (
          <button
            key={tab.id}
            className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-2 text-white"
          >
            {iconSrc ? (
              // Recolored white via CSS mask (so it stays legible on the
              // orange bar regardless of the color baked into the uploaded
              // file), same technique used for TopBar's icons.
              <span
                aria-hidden
                className="h-[26px] w-[26px] bg-white"
                style={{
                  WebkitMaskImage: `url(${iconSrc})`,
                  maskImage: `url(${iconSrc})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
            ) : (
              <span className="text-2xl leading-none">{tab.fallbackEmoji}</span>
            )}
            <span className="text-[11px] leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
