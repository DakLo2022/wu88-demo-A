"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";
import { FAQ_ITEMS } from "@/data/helpCenter";

type Props = { images: Record<string, string | null> };

// 常見問題 — confirmed live at wu88.live/client/qa: a list of orange-gradient
// Q&A accordion rows, same FAQ_ITEMS content already used by desktop
// HelpCenterModal's FaqTab (verbatim short functional copy from the real
// site).
export default function MobileHelpFaqScreen({ images }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="常見問題" images={images} backHref="/my" />
      <div className="flex-1 overflow-y-auto bg-[#f0eff5] px-4 py-4">
        <div className="flex flex-col gap-2.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="overflow-hidden rounded-[8px] bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-start gap-2.5 px-3.5 py-3 text-left text-[13px] text-black"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#f4702a] text-[11px] font-bold text-white">
                    Q
                  </span>
                  <span className="flex-1">{item.q}</span>
                </button>
                {isOpen ? (
                  <div className="flex items-start gap-2.5 border-t border-black/5 bg-black/[0.02] px-3.5 py-3 text-[12px] leading-relaxed text-black/60">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black/20 text-[11px] font-bold text-white">
                      A
                    </span>
                    <span>{item.a}</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
