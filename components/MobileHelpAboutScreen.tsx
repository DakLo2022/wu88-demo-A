"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";
import { RULES_AND_TERMS, PRIVACY_POLICY, type AboutDoc } from "@/data/helpCenter";

type Props = { images: Record<string, string | null> };

// 關於我們 — reuses the same paraphrased/condensed 規則與條款 + 隱私權政策
// content as desktop HelpCenterModal's AboutTab (long-form legal text is
// summarized per this project's copyright policy, not reproduced verbatim).
export default function MobileHelpAboutScreen({ images }: Props) {
  const [doc, setDoc] = useState<AboutDoc | null>(null);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title={doc ? doc.title : "關於我們"} images={images} backHref="/my" />
      {doc ? (
        <div className="flex-1 overflow-y-auto bg-white px-4 py-4">
          <button type="button" onClick={() => setDoc(null)} className="mb-3 text-[13px] text-[#e06018]">
            ← 返回
          </button>
          <div className="flex flex-col gap-3 text-[13px] leading-relaxed text-black/70">
            {doc.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto bg-[#f0eff5] px-4 py-4">
          <div className="flex flex-col gap-2.5">
            {[RULES_AND_TERMS, PRIVACY_POLICY].map((d) => (
              <button
                key={d.title}
                type="button"
                onClick={() => setDoc(d)}
                className="rounded-[8px] bg-white px-4 py-3.5 text-left text-[14px] text-black"
              >
                {d.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
