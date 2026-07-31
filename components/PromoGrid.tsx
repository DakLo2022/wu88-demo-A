import { promoCards } from "@/data/promos";

type Props = {
  images: Record<string, string | null>;
};

// Grid of promo tiles. Section background is white to match the reference
// layout; each card keeps a fixed 233:180 aspect ratio (so it scales
// proportionally at any width) and shows its uploaded background image
// (bgSlotId) full-bleed, or falls back to a colored gradient. A small
// corner icon (iconSlotId) can optionally be layered on top. Card label is
// bold white text only, no subtitle line.
export default function PromoGrid({ images }: Props) {
  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-3 px-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
        {promoCards.map((card) => {
          const bgSrc = images[card.bgSlotId];
          const iconSrc = images[card.iconSlotId];
          return (
            <div
              key={card.id}
              className={`group relative aspect-[233/180] w-full overflow-hidden rounded-lg shadow-md transition hover:-translate-y-1 ${
                bgSrc ? "bg-brand-dark" : `bg-gradient-to-br ${card.accentClass}`
              }`}
            >
              {bgSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}

              {iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={iconSrc} alt="" className="absolute right-3 top-3 h-8 w-8 object-contain" />
              ) : (
                !bgSrc && (
                  <span className="absolute right-3 top-3 text-2xl opacity-70">{card.fallbackIcon}</span>
                )
              )}

              <div className="absolute inset-x-0 bottom-0 bg-black/50 px-3 py-2 text-center">
                <p className="text-sm font-bold text-white">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
