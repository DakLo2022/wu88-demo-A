"use client";

import { useEffect, useState } from "react";
import { heroSlides } from "@/data/promos";
import { getImageTransformStyle, mobileSlotKey, DEFAULT_IMAGE_TRANSFORM, type ImageTransform } from "@/lib/imageTransform";

type Props = {
  images: Record<string, string | null>;
  positions: Record<string, ImageTransform>;
};

// Auto-advancing carousel. Each slide renders its uploaded image (desktop
// always visible; mobile swaps in below `md` and falls back to the desktop
// file until a mobile-specific one is uploaded in /image-manager) or a
// decorative CSS-only placeholder if nothing has been uploaded yet.
export default function HeroCarousel({ images, positions }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="relative flex h-[300px] items-center justify-center bg-gradient-to-br from-brand-accent/40 via-brand-dark to-black md:h-[440px]">
        {heroSlides.map((slide, idx) => {
          const desktopSrc = images[slide.slotId];
          const mobileSrc = images[mobileSlotKey(slide.slotId)] ?? desktopSrc;
          const desktopTransform = positions[slide.slotId] ?? DEFAULT_IMAGE_TRANSFORM;
          const mobileTransform = positions[mobileSlotKey(slide.slotId)] ?? desktopTransform;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                idx === active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {desktopSrc ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={desktopSrc}
                    alt={slide.title}
                    className="hidden h-full w-full object-cover md:block"
                    style={getImageTransformStyle(desktopTransform)}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mobileSrc ?? desktopSrc}
                    alt={slide.title}
                    className="block h-full w-full object-cover md:hidden"
                    style={getImageTransformStyle(mobileTransform)}
                  />
                </>
              ) : (
                <div className="relative flex h-full w-full items-center justify-center">
                  <div className="sparkle absolute inset-0 opacity-20" />
                  <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-accent/30 blur-3xl" />
                  <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-brand-accent/20 blur-3xl" />
                  <div className="relative z-10 text-center">
                    <p className="text-3xl font-extrabold tracking-wide text-white drop-shadow md:text-5xl">
                      {slide.title}
                    </p>
                    <p className="mt-3 text-sm text-white/70 md:text-base">{slide.label}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => setActive((i) => (i - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
          aria-label="上一張"
        >
          ‹
        </button>
        <button
          onClick={() => setActive((i) => (i + 1) % heroSlides.length)}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
          aria-label="下一張"
        >
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActive(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === active ? "w-5 bg-brand-accent" : "w-1.5 bg-white/40"
              }`}
              aria-label={`切換到第 ${idx + 1} 張`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
