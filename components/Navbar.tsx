"use client";

import { useState } from "react";
import Link from "next/link";
import { navCategories, promoNavLabel } from "@/data/nav";
import { navProviderSlotId } from "@/lib/imageSlots";

type Props = {
  images: Record<string, string | null>;
};

// Main site navigation. Reused on every page via app/page.tsx, which fetches
// the current image slot map server-side and passes it down as a prop (this
// component needs client-side hover state, so it can't call the fs-based
// getSlotImageMap() itself). Hovering any category (except 優惠活動) opens a
// full-width dropdown panel listing that category's providers; each
// provider's icon comes from its own image-manager "provider" slot.
export default function Navbar({ images }: Props) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const activeCategory = navCategories.find((c) => c.key === hoveredKey);
  const logoSrc = images["logo"];

  return (
    <header
      className="relative border-b border-white/10 bg-white"
      onMouseLeave={() => setHoveredKey(null)}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt="Logo" className="h-10 w-auto max-w-[180px] object-contain" />
          ) : (
            <div className="flex h-10 w-32 items-center justify-center rounded bg-brand-orange text-sm font-bold text-white">
              LOGO
            </div>
          )}
        </Link>

        <nav className="hidden items-center gap-4 text-[15px] font-medium text-brand-dark/80 md:flex">
          {navCategories.map((cat, idx) => (
            <Link
              key={cat.key}
              href={`/category/${cat.key}`}
              onMouseEnter={() => setHoveredKey(cat.key)}
              className={`flex items-center gap-1.5 py-1 transition hover:text-brand-orange ${
                idx > 0 ? "border-l border-neutral-200 pl-4" : ""
              } ${hoveredKey === cat.key ? "text-brand-orange" : ""}`}
            >
              {cat.icon && <span className="text-lg">{cat.icon}</span>}
              {cat.label}
            </Link>
          ))}
          <Link
            href="/promotions"
            onMouseEnter={() => setHoveredKey(null)}
            className="border-l border-neutral-200 py-1 pl-4 font-semibold text-brand-orange transition hover:text-brand-orangeDark"
          >
            {promoNavLabel}
          </Link>
        </nav>
      </div>

      {/* Full-width hover dropdown: grid of provider icon + name for the
          currently-hovered category. Icons come from /image-manager's
          "provider" slots; falls back to a plain circle placeholder. */}
      {activeCategory && (
        <div className="absolute inset-x-0 top-full z-30 max-h-[80vh] overflow-y-auto border-t border-neutral-100 bg-white shadow-lg">
          <div className="mx-auto flex max-w-[1320px] flex-wrap justify-center gap-x-4 gap-y-6 px-6 py-6">
            {activeCategory.providers.map((name, idx) => {
              const slotId = navProviderSlotId(activeCategory.key, idx);
              const src = images[slotId];
              return (
                <div
                  key={slotId}
                  className="flex w-[165px] cursor-pointer flex-col items-center gap-2 rounded-lg px-2 py-3 text-center transition-colors hover:bg-neutral-100"
                >
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={name}
                      className="aspect-[300/360] w-full object-contain"
                    />
                  ) : (
                    <div className="flex aspect-[300/360] w-full items-center justify-center rounded-lg bg-neutral-100 text-4xl text-neutral-300">
                      🎮
                    </div>
                  )}
                  <span className="text-sm text-neutral-700">{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
