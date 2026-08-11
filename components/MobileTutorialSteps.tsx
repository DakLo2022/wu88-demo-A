"use client";

import { useState } from "react";
import { type TutorialFlow } from "@/data/helpCenter";
import { helpCenterStepSlotId } from "@/lib/imageSlots";
import { mobileSlotKey } from "@/lib/imageTransform";

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// Mobile version of the shared paginated screenshot-tutorial viewer used by
// desktop HelpCenterModal's TutorialSteps — same two pagination styles
// (numbered dots vs "X / Y" counter), same per-step upload slots, just
// narrower/full-width for a phone screen instead of a ~800px modal.
export default function MobileTutorialSteps({
  flowDef,
  images,
  afterImage,
}: {
  flowDef: TutorialFlow;
  images: Record<string, string | null>;
  afterImage?: React.ReactNode;
}) {
  const [step, setStep] = useState(1);
  const { flow, count, pagination } = flowDef;
  const src = pickImage(images, helpCenterStepSlotId(flow, step));

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-5">
      {afterImage}

      <div
        className="flex w-full items-center justify-center overflow-hidden rounded-[8px] border border-black/10 bg-black/[0.02]"
        style={{ minHeight: 280 }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`步驟 ${step}`} className="max-h-[420px] w-auto object-contain" />
        ) : (
          <span className="p-8 text-center text-[12px] text-black/35">
            步驟 {step}／{count}（請至 /image-manager 上傳截圖）
          </span>
        )}
      </div>

      {pagination === "dots" ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setStep(n)}
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[13px] ${
                n === step ? "bg-[#e06018] text-white" : "text-black/60"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            aria-label="上一步"
            className="text-[18px] text-black/50 disabled:opacity-30"
          >
            ‹‹
          </button>
          <span className="text-[14px] font-medium text-[#e06018]">
            {step} / {count}
          </span>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(count, s + 1))}
            disabled={step === count}
            aria-label="下一步"
            className="text-[18px] text-black/50 disabled:opacity-30"
          >
            ››
          </button>
        </div>
      )}
    </div>
  );
}
