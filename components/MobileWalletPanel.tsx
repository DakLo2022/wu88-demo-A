"use client";

import { useState } from "react";
import { mobileSlotKey } from "@/lib/imageTransform";
import { WALLET_CATEGORIES, SUB_WALLETS } from "@/data/mobileWallets";

// Prefers whichever was actually uploaded — the mobile-specific image
// (stored under the "__mobile" key when uploaded via the "手機" tab in
// /image-manager) or the plain/desktop one. Same fix as
// MobileCategoryExplorer/MobileAuthCard's pickImage: this panel is
// mobile-only, so uploading via the "手機" tab is the natural choice, but a
// component that only reads the plain key never sees that "__mobile" one —
// which is exactly why the refresh/category-arrow icons looked like they
// "didn't upload" even though the files saved fine.
function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// Full-screen wallet dropdown opened by tapping the down-arrow next to the
// balance in the mobile logged-in header.
//
// Structure is per explicit user spec (a reference screenshot), not a raw
// copy of the live site's own container grouping:
//   - 容器1 ("錢包金額" label + "刷新" pill + "全部錢包" category selector)
//     is the single outer white rounded box — 容器2 (the wallet list) is
//     NESTED inside it, not a separate sibling box with its own gap/radius.
//   - 容器2: every row gets a full border (not just a bottom divider) and
//     sits flush against its neighbors (0 gap, borders touch/share an
//     edge via negative margin), giving the grid look in the reference
//     image.
//   - every row: wallet name pinned left, 12px from the row's left edge;
//     amount + 一鍵轉入/一鍵回收 button pinned right as a pair (12px gap
//     between them), 12px from the row's right edge.
//   - no "收起" button — tapping the dimmed backdrop outside the panel
//     closes it (the outer fixed div's own onClick already does this).
//
// The category list itself (全部錢包/體育投注/真人遊戲/電子遊戲/彩票投注/
// 棋牌遊戲/電競投注/直播視訊) and the selected-option style (light-orange
// wash + orange text) were confirmed live against wu88.live's real
// wallet-category `<select>` — getComputedStyle on `.v-list-item--active`
// showed text color rgb(232,85,20) with a ::before overlay of the same
// color at 0.12 opacity, i.e. exactly "淺橘色包裹、橘色字體". Built as a
// custom dropdown here (not a native <select>) since that per-option wash
// styling isn't achievable with native <option> elements.
// WALLET_CATEGORIES and SUB_WALLETS now live in data/mobileWallets.ts,
// shared with the /transfer and /withdrawal pages' own wallet grid
// (MobileWalletGrid.tsx), which reuse this exact same live-verified
// category mapping (also fixed a missing "SA真人錢包" 真人遊戲 entry that
// this file's own earlier inline copy had dropped).

type Props = {
  open: boolean;
  onClose: () => void;
  mainBalance: number;
  images: Record<string, string | null>;
};

// CSS-mask recolored icon (same trick used throughout the rest of the
// project, e.g. TopBar.tsx's MaskIcon) — lets an uploaded SVG/PNG be tinted
// via a plain background color rather than baking a fixed color into the
// uploaded file itself.
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

export default function MobileWalletPanel({ open, onClose, mainBalance, images }: Props) {
  const [category, setCategory] = useState("全部錢包");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  if (!open) return null;

  const refreshIconSrc = pickImage(images, "mobile-wallet-refresh-icon");
  const categoryArrowSrc = pickImage(images, "mobile-wallet-category-arrow");

  const rowRightClass = "flex flex-shrink-0 items-center gap-[12px] pr-[12px]";

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-center bg-black/50 pt-[50px]"
      onClick={() => {
        onClose();
        setShowCategoryMenu(false);
      }}
    >
      {/* 容器1（錢包金額／刷新／全部錢包）包裹著容器2（錢包清單）—— 一個外層
          白色圓角盒子，不是兩個分開的盒子。收起改成點擊外部背景關閉，同一個
          onClick 就在最外層的 fixed 背景 div 上，不需要額外的「收起」按鈕。 */}
      <div
        className="max-h-[90vh] w-[300px] overflow-y-auto rounded-[6px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 容器1：錢包金額／刷新／全部錢包 */}
        <div className="flex items-center justify-between px-2 py-[12px]">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-semibold text-[#202020]">錢包金額</span>
            <button
              type="button"
              className="flex h-[20px] items-center gap-1 rounded-[4px] bg-[#eb5e1a] px-2 text-[12px] text-white"
            >
              {refreshIconSrc ? (
                <MaskIcon src={refreshIconSrc} className="block h-3 w-3 flex-shrink-0 bg-white" />
              ) : (
                <span aria-hidden>🔄</span>
              )}
              刷新
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryMenu((v) => !v)}
              className={`flex h-[28px] items-center rounded-[15px] border px-2 text-[12px] ${
                category !== "全部錢包"
                  ? "border-[#e85514] bg-[#e85514]/[0.12] text-[#e85514]"
                  : "border-black/[0.38] text-black/70"
              }`}
            >
              {category}
              {categoryArrowSrc ? (
                <MaskIcon
                  src={categoryArrowSrc}
                  className={`ml-1 block h-3 w-3 flex-shrink-0 bg-current transition-transform ${
                    showCategoryMenu ? "rotate-180" : ""
                  }`}
                />
              ) : (
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className={`ml-1 h-3 w-3 transition-transform ${showCategoryMenu ? "rotate-180" : ""}`}
                  fill="currentColor"
                >
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

        {/* 容器2：錢包清單 — 每一列都有自己的邊匡，彼此 0 距離貼齊。巢狀在容器1
            裡面，不再有自己的外邊距/圓角，因為它是容器1的一部分。 */}
        <div className="overflow-hidden">
          <div className="flex h-[50px] items-center justify-between border border-[#e1e2e2] bg-white">
            <span className="pl-[12px] text-[12px] font-semibold text-[#585858]">錢包</span>
            <div className={rowRightClass}>
              <span className="text-[12px] text-black">{mainBalance}</span>
              <button
                type="button"
                className="h-[20px] flex-shrink-0 rounded-[10px] bg-[#ab9b57] px-[9px] text-[11px] text-white shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),0_2px_2px_0_rgba(0,0,0,0.14),0_1px_5px_0_rgba(0,0,0,0.12)]"
              >
                一鍵回收
              </button>
            </div>
          </div>

          {SUB_WALLETS.filter((w) => category === "全部錢包" || w.category === category).map(({ name }) => (
            <div
              key={name}
              className="-mt-px flex h-[50px] items-center justify-between border border-[#e1e2e2] bg-white"
            >
              <span className="max-w-[110px] pl-[12px] text-[12px] font-semibold leading-tight text-[#585858]">
                {name}
              </span>
              <div className={rowRightClass}>
                <span className="text-[12px] text-black">0</span>
                <button
                  type="button"
                  className="h-[20px] flex-shrink-0 rounded-[10px] bg-[#eb5e1a] px-[9px] text-[11px] text-white shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),0_2px_2px_0_rgba(0,0,0,0.14),0_1px_5px_0_rgba(0,0,0,0.12)]"
                >
                  一鍵轉入
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
