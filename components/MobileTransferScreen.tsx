"use client";

import { useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import { SUB_WALLETS } from "@/data/mobileWallets";
import MobileWalletGrid from "./MobileWalletGrid";
import MobileBottomNav from "./MobileBottomNav";

type Props = { images: Record<string, string | null> };

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

const ALL_WALLET_NAMES = ["錢包", ...SUB_WALLETS.map((w) => w.name)];

// 額度轉換 (/transfer) — reached via 存提 popup's 轉點 button. Confirmed live
// on wu88.live/transfer:
//   - header: standard back-arrow + centered "額度轉換" title on the brand
//     gradient (same 50px header used everywhere else in this project).
//   - 錢包金額/全部錢包 wallet grid: shared with 託售, see MobileWalletGrid.tsx
//     — opens already fully expanded here (showing "收起"), unlike 託售
//     which opens collapsed.
//   - 自動轉換 (auto-convert) toggle: 20px/500 black label + an inset switch
//     (confirmed live track color rgb(234,85,20) ≈ #ea5514, white thumb —
//     screenshot JPEG compression made this look pale grey at this tiny
//     size, but getComputedStyle confirmed the real orange value), off by
//     default.
//   - manual transfer form: "選擇轉點場館錢包" grey sub-label, then a
//     轉出錢包/轉入錢包 pair of orange pill selects (155×30, flat #eb5e1a,
//     radius 4px, confirmed live — NOT a dark/light pair as a quick glance
//     might suggest) with a small swap icon between them, a "*場館錢包間
//     不可互轉" note, then 金額 input with an inline 最大 button, and a
//     full-width 送出 submit button (300×44, flat #eb5e1a, radius 4px).
export default function MobileTransferScreen({ images }: Props) {
  const [autoConvert, setAutoConvert] = useState(false);
  const [fromWallet, setFromWallet] = useState(ALL_WALLET_NAMES[0]);
  const [toWallet, setToWallet] = useState(ALL_WALLET_NAMES[1] ?? ALL_WALLET_NAMES[0]);
  const [amount, setAmount] = useState("");

  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");
  const swapIconSrc = pickImage(images, "mobile-transfer-swap-icon");

  function swapWallets() {
    setFromWallet(toWallet);
    setToWallet(fromWallet);
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <header className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-b from-brand-from to-brand-to px-2 text-white">
        <Link href="/" aria-label="返回首頁" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {backArrowSrc ? (
            <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </Link>
        <h1 className="flex-1 text-center text-[18px]">額度轉換</h1>
        <span className="h-8 w-8 flex-shrink-0" aria-hidden />
      </header>

      <div className="flex-1 overflow-y-auto bg-white">
        <MobileWalletGrid images={images} defaultExpanded />

        <div className="px-3 pb-8">
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-medium text-black/[0.87]">自動轉換</span>
            <button
              type="button"
              role="switch"
              aria-checked={autoConvert}
              onClick={() => setAutoConvert((v) => !v)}
              className="relative h-[22px] w-[40px] flex-shrink-0 rounded-full bg-[#ea5514]"
            >
              <span
                className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all ${
                  autoConvert ? "left-[20px]" : "left-[3px]"
                }`}
              />
            </button>
          </div>

          <p className="mt-3 text-[13px] text-black/50">選擇轉點場館錢包</p>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="h-3 w-[3px] bg-[#eb5e1a]" aria-hidden />
                <span className="text-[13px] text-black/70">轉出錢包</span>
              </div>
              <select
                value={fromWallet}
                onChange={(e) => setFromWallet(e.target.value)}
                className="h-[30px] w-full appearance-none rounded-[4px] bg-[#eb5e1a] px-3 text-[14px] font-medium text-white"
              >
                {ALL_WALLET_NAMES.map((name) => (
                  <option key={name} value={name} className="text-black">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={swapWallets}
              aria-label="交換轉出/轉入錢包"
              className="mt-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#eb5e1a] text-white"
            >
              {swapIconSrc ? (
                <MaskIcon src={swapIconSrc} className="h-3.5 w-3.5 bg-white" />
              ) : (
                <span aria-hidden className="text-[12px] leading-none">»</span>
              )}
            </button>

            <div className="flex-1">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="h-3 w-[3px] bg-[#eb5e1a]" aria-hidden />
                <span className="text-[13px] text-black/70">轉入錢包</span>
              </div>
              <select
                value={toWallet}
                onChange={(e) => setToWallet(e.target.value)}
                className="h-[30px] w-full appearance-none rounded-[4px] bg-[#eb5e1a] px-3 text-[14px] font-medium text-white"
              >
                {ALL_WALLET_NAMES.map((name) => (
                  <option key={name} value={name} className="text-black">
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-2 text-[12px] text-black/40">ⓘ *場館錢包間不可互轉</p>

          <h2 className="mt-5 text-[16px] font-semibold text-[#202020]">金額</h2>
          <div className="mt-2 flex h-[40px] items-center rounded-[4px] border border-black/10">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="請輸入金額(必須為整數)"
              inputMode="numeric"
              className="h-full flex-1 rounded-l-[4px] px-3 text-[13px] text-black placeholder:text-[#eb5e1a] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setAmount("0")}
              className="mr-1 h-[28px] flex-shrink-0 rounded-[4px] bg-[#eb5e1a] px-3 text-[13px] font-medium text-white"
            >
              最大
            </button>
          </div>

          <button
            type="button"
            className="mt-5 h-[44px] w-full rounded-[4px] bg-[#eb5e1a] text-[14px] font-medium text-white"
          >
            送出
          </button>
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
