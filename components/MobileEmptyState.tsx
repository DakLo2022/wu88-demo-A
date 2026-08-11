"use client";

import { mobileSlotKey } from "@/lib/imageTransform";

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// Shared "no data" placeholder — reuses the same wavy illustration slot as
// MobileTradeScreen's empty state, since every one of these fake-backend
// record lists (帳戶明細's 5 tabs, 投注記錄) has no real data to show.
export default function MobileEmptyState({
  images,
  message = "暫無相關資料",
}: {
  images: Record<string, string | null>;
  message?: string;
}) {
  const src = pickImage(images, "mobile-trade-empty-illustration");
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-[160px] w-[160px] object-contain opacity-80" />
      ) : (
        <span aria-hidden className="text-6xl opacity-60">
          📭
        </span>
      )}
      <p className="text-[14px] tracking-widest text-black/40">{message}</p>
    </div>
  );
}
