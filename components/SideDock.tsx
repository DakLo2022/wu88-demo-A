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

  return (
    <>
      <div className="fixed left-0 top-1/3 z-40 hidden flex-col overflow-hidden rounded-r-lg border border-white/10 bg-brand-panel/95 shadow-lg lg:flex">
        {dockItems.map((item) => {
          const iconSrc = images[item.slotId];
          return (
            <button
              key={item.label}
              className="flex w-16 flex-col items-center gap-1 border-b border-white/10 px-2 py-3 text-[11px] text-white/80 last:border-b-0 hover:bg-brand-orange/20 hover:text-white"
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

      <button
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-panel/95 text-white shadow-lg hover:bg-brand-orange"
        aria-label="會員中心"
      >
        👤
      </button>
    </>
  );
}
