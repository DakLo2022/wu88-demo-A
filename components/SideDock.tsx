import { getSlotImageMap } from "@/lib/imageSlotsServer";

const dockItems = [
  { icon: "🎧", label: "在線客服", slotId: "sidedock-cs" },
  { icon: "💬", label: "Line客服", slotId: "sidedock-line" },
  { icon: "✉️", label: "電子信箱", slotId: "sidedock-mail" },
  { icon: "📲", label: "APP下載", slotId: "sidedock-app" },
];

// Floating vertical dock, fixed to the left edge on desktop. Each item can
// have its own icon uploaded via /image-manager; falls back to an emoji.
export default function SideDock() {
  const images = getSlotImageMap();
  const csIconSrc = images["sidedock-cs-right"];

  return (
    <>
      <div className="fixed left-0 top-1/3 z-40 hidden flex-col overflow-hidden rounded-r-lg border border-white/10 bg-brand-panel/95 shadow-lg lg:flex">
        {dockItems.map((item) => {
          const iconSrc = images[item.slotId];
          return (
            <button
              key={item.label}
              className="flex w-16 flex-col items-center gap-1 border-b border-white/10 px-2 py-3 text-[11px] text-white/80 last:border-b-0 hover:bg-brand-accent/20 hover:text-white"
            >
              {iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={iconSrc} alt="" className="h-5 w-5 object-contain" />
              ) : (
                <span className="text-lg">{item.icon}</span>
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right-edge 客服 button, vertically centered, fixed (doesn't scroll).
          Full circle, dark by default; on hover it turns brand-accent and a
          "協助中心" label bubble slides/fades in to its left. */}
      <div className="group fixed right-0 top-1/2 z-40 -translate-y-1/2">
        <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand-accent px-4 py-2 text-sm text-white opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
          協助中心
        </span>
        {/* Left-rounded pill flush against the right edge, with a
            white-ringed circle inset (shape matches JIN's version). */}
        <button
          className="flex h-20 w-20 items-center justify-center rounded-l-full bg-neutral-800/90 shadow-lg transition-colors duration-300 group-hover:bg-brand-accent"
          aria-label="客服"
        >
          <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-white">
            {csIconSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={csIconSrc} alt="" className="h-9 w-9 object-contain" />
            ) : (
              <span className="text-2xl text-white/80">👤</span>
            )}
          </span>
        </button>
      </div>
    </>
  );
}
