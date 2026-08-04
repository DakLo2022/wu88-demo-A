"use client";

import { useEffect, useState } from "react";
import { heroSlides, announcements } from "@/data/promos";
import { getImageTransformStyle, mobileSlotKey, DEFAULT_IMAGE_TRANSFORM, type ImageTransform } from "@/lib/imageTransform";

type Props = {
  images: Record<string, string | null>;
  positions: Record<string, ImageTransform>;
};

// Mobile-only hero: full-bleed 157px-tall banner with the announcement
// ticker layered directly on top of it (orange/70 strip pinned to the top
// edge, icon instead of a "公告" text tag) — matches wu88.live's mobile
// layout, where the ticker overlaps the banner instead of sitting in its
// own row like the desktop version.
export default function MobileHeroBanner({ images, positions }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const combinedText = announcements.map((a) => a.text).join("　|　");

  return (
    <div className="relative h-[157px] w-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-brand-accent/40 via-brand-dark to-black">
      {heroSlides.map((slide, idx) => {
        const desktopSrc = images[slide.slotId];
        const mobileSrc = images[mobileSlotKey(slide.slotId)] ?? desktopSrc;
        const transform =
          positions[mobileSlotKey(slide.slotId)] ?? positions[slide.slotId] ?? DEFAULT_IMAGE_TRANSFORM;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              idx === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {mobileSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mobileSrc}
                alt={slide.title}
                className="h-full w-full object-cover"
                style={getImageTransformStyle(transform)}
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="sparkle absolute inset-0 opacity-20" />
                <p className="relative z-10 px-4 text-center text-base font-extrabold text-white drop-shadow">
                  {slide.title}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Slide dots */}
      <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {heroSlides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setActive(idx)}
            className={`h-1 rounded-full transition-all ${
              idx === active ? "w-4 bg-brand-accent" : "w-1 bg-white/40"
            }`}
            aria-label={`切換到第 ${idx + 1} 張`}
          />
        ))}
      </div>

      {/* Announcement ticker, overlaid on the banner's top edge */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-2 bg-[rgba(var(--brand-accent-rgb),0.7)] px-2 py-1.5">
        <span className="flex-shrink-0 text-base leading-none" aria-hidden>
          📢
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="marquee-track flex w-max whitespace-nowrap text-xs text-white">
            <span className="pr-10">{combinedText}</span>
            <span className="pr-10">{combinedText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
