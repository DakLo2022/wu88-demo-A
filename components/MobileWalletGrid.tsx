"use client";

import { useState } from "react";
import { mobileSlotKey } from "@/lib/imageTransform";
import { WALLET_CATEGORIES, SUB_WALLETS } from "@/data/mobileWallets";

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

function MaskIcon({ src, className }: { src: string; className: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

type Props = {
  images: Record<string, string | null>;
  // /transfer opens with the grid already fully expanded ("收起" shown);
  // /withdrawal opens collapsed to just the first row ("展開" shown) —
  // confirmed live, the only real difference between the two pages' grid
  // section (everything else — the 錢包金額/刷新/全部錢包 bar, the 4-column
  // card layout, the 一鍵回收/一鍵轉入 buttons — is identical on both).
  defaultExpanded: boolean;
};

// The 錢包金額 / 全部錢包 wallet grid shared by wu88.live's 額度轉換
// (/transfer) and 託售 (/withdrawal) pages — confirmed live it's the SAME
// component mounted on both real pages (same class names, same card
// markup), just with a different default expand state. This is a
// DIFFERENT layout from the same wallet data's header-dropdown version
// (MobileWalletPanel.tsx, a vertical list) — confirmed live via
// getBoundingClientRect that the grid page renders genuine 4-column white
// cards (89.5×115, 1px #e1e2e2 border, 3px radius, 5px margin), not the
// list rows used in the dropdown.
export default function MobileWalletGrid({ images, defaultExpanded }: Props) {
  const [category, setCategory] = useState("全部錢包");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const refreshIconSrc = pickImage(images, "mobile-wallet-grid-refresh-icon");
  const categoryArrowSrc = pickImage(images, "mobile-wallet-grid-category-arrow");
  const expandArrowSrc = pickImage(images, "mobile-wallet-grid-expand-arrow");

  const filteredSubWallets = SUB_WALLETS.filter((w) => category === "全部錢包" || w.category === category);
  // Master "錢包" wallet is always first, exactly like the header dropdown.
  const allWallets = [{ name: "錢包", isMaster: true }, ...filteredSubWallets.map((w) => ({ name: w.name, isMaster: false }))];
  const visibleWallets = expanded ? allWallets : allWallets.slice(0, 4);

  return (
    <div className="bg-white px-3 pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-semibold text-[#202020]">錢包金額</span>
          <button
            type="button"
            className="flex h-5 items-center gap-1 rounded-[4px] bg-[#eb5e1a] px-2 text-[14px] font-medium text-white"
          >
            {refreshIconSrc ? (
              <MaskIcon src={refreshIconSrc} className="block h-3 w-3 flex-shrink-0 bg-white" />
            ) : (
              <span aria-hidden className="text-[10px] leading-none">🔄</span>
            )}
            刷新
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategoryMenu((v) => !v)}
            className={`flex h-[28px] items-center rounded-[15px] border-2 px-2 text-[12px] ${
              category !== "全部錢包" ? "border-[#e85514] bg-[#e85514]/[0.12] text-[#e85514]" : "border-black/[0.38] text-black/70"
            }`}
          >
            {category}
            {categoryArrowSrc ? (
              <MaskIcon
                src={categoryArrowSrc}
                className={`ml-1 block h-3 w-3 flex-shrink-0 bg-current transition-transform ${showCategoryMenu ? "rotate-180" : ""}`}
              />
            ) : (
              <svg aria-hidden viewBox="0 0 24 24" className={`ml-1 h-3 w-3 transition-transform ${showCategoryMenu ? "rotate-180" : ""}`} fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            )}
          </button>

          {showCategoryMenu ? (
            <div className="absolute right-0 top-full z-10 mt-1 w-[130px] overflow-hidden rounded-[6px] bg-white py-1 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              {WALLET_CATEGORIES.map((c) => {
                const active = c === category;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      setShowCategoryMenu(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-[12px] ${
                      active ? "bg-[#e85514]/[0.12] font-semibold text-[#e85514]" : "text-black/80"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap">
        {visibleWallets.map((w) => (
          <li
            key={w.name}
            className="m-[5px] flex w-[calc(25%-10px)] flex-col items-center gap-1.5 rounded-[3px] border border-[#e1e2e2] bg-white py-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
          >
            <span className="max-w-full truncate px-1 text-center text-[11px] font-semibold text-[#585858]">{w.name}</span>
            <span className="text-[12px] text-black">0</span>
            <button
              type="button"
              className={`h-[20px] flex-shrink-0 rounded-[10px] px-[9px] text-[11px] text-white shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),0_2px_2px_0_rgba(0,0,0,0.14),0_1px_5px_0_rgba(0,0,0,0.12)] ${
                w.isMaster ? "bg-[#ab9b57]" : "bg-[#eb5e1a]"
              }`}
            >
              {w.isMaster ? "一鍵回收" : "一鍵轉入"}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="my-4 flex w-full items-center justify-center gap-1 text-[16px] text-[#a1a7a5]"
      >
        {expanded ? "收起" : "展開"}
        {expandArrowSrc ? (
          <MaskIcon
            src={expandArrowSrc}
            className={`block h-3 w-3 flex-shrink-0 bg-current transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
