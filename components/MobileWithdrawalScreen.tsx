"use client";

import { useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
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

const METHOD_TABS = ["銀行卡", "USDT"] as const;

// 託售 (/withdrawal) — reached via 存提 popup's 託售 button. Confirmed live on
// wu88.live/withdrawal (page URL is /withdrawal even though the tab/title
// both say "託售"):
//   - header: standard back-arrow + centered "託售" title on the brand
//     gradient.
//   - 錢包金額/全部錢包 wallet grid: shared with 額度轉換, see
//     MobileWalletGrid.tsx — opens COLLAPSED here (showing "展開"), the
//     only real difference from /transfer's copy of the same grid.
//   - 銀行卡/USDT underline tabs (confirmed live: active tab text + 2px
//     underline both rgb(232,85,20) ≈ #e85514, 48px tall, each tab exactly
//     half the row's width).
//   - existing bound card row: a full-width flat #eb5e1a bar (confirmed
//     live via elementFromPoint — NOT a rounded/floating card), white text
//     "004 臺灣銀行 1405******9300" + a checkmark on the right showing it's
//     selected, then a plain "＋新增" link below it to add another card.
//   - 金額 input with an inline 最大 button (flat #eb5e1a, 52×28, radius
//     4px, confirmed live), 交易密碼 password input, a real-site copy of
//     the turnover/limit notice text (grey #7a7d84), and a full-width 送出
//     submit button (300×44, flat #eb5e1a, radius 4px — identical to
//     /transfer's own submit button style).
export default function MobileWithdrawalScreen({ images }: Props) {
  const [methodTab, setMethodTab] = useState<(typeof METHOD_TABS)[number]>("銀行卡");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");

  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");
  const bankIconSrc = pickImage(images, "mobile-withdrawal-method-bank-icon");
  const checkIconSrc = pickImage(images, "mobile-withdrawal-card-check-icon");
  const addIconSrc = pickImage(images, "mobile-withdrawal-add-icon");

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
        <h1 className="flex-1 text-center text-[18px]">託售</h1>
        <span className="h-8 w-8 flex-shrink-0" aria-hidden />
      </header>

      <div className="flex-1 overflow-y-auto bg-white">
        <MobileWalletGrid images={images} defaultExpanded={false} />

        <div className="flex border-b border-black/10">
          {METHOD_TABS.map((tab) => {
            const active = tab === methodTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setMethodTab(tab)}
                className={`h-[48px] flex-1 text-[14px] font-bold ${
                  active ? "border-b-2 border-[#e85514] text-[#e85514]" : "text-black"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="px-3 pt-3">
          {methodTab === "銀行卡" ? (
            <>
              <div className="flex h-[40px] items-center justify-between rounded-[4px] bg-[#eb5e1a] px-4">
                <div className="flex items-center gap-2 text-white">
                  {bankIconSrc ? (
                    <img src={bankIconSrc} alt="" className="h-5 w-5 object-contain" />
                  ) : (
                    <span aria-hidden>🏦</span>
                  )}
                  <span className="text-[13px]">004 臺灣銀行 1405******9300</span>
                </div>
                {checkIconSrc ? (
                  <MaskIcon src={checkIconSrc} className="h-4 w-4 flex-shrink-0 bg-white" />
                ) : (
                  <span aria-hidden className="text-white">✓</span>
                )}
              </div>

              <button type="button" className="mt-3 flex w-full items-center justify-center gap-1.5 text-[14px] font-bold text-black/80">
                {addIconSrc ? (
                  <MaskIcon src={addIconSrc} className="h-3.5 w-3.5 bg-current" />
                ) : (
                  <span aria-hidden>＋</span>
                )}
                新增
              </button>
            </>
          ) : (
            <p className="py-4 text-center text-[13px] text-black/40">請先綁定 USDT 錢包地址</p>
          )}

          <h2 className="mt-4 text-[16px] font-semibold text-[#202020]">金額</h2>
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
              className="mr-1 h-[28px] flex-shrink-0 rounded-[4px] bg-[#eb5e1a] px-3 text-[12px] font-medium text-white"
            >
              最大
            </button>
          </div>

          <h2 className="mt-4 text-[16px] font-semibold text-[#7a7d84]">交易密碼</h2>
          <div className="mt-2 flex h-[40px] items-center rounded-[4px] border border-black/10">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="h-full w-full rounded-[4px] px-3 text-[13px] text-black focus:outline-none"
            />
          </div>

          <p className="mt-3 text-[12px] leading-relaxed text-[#7a7d84]">
            所需流水: <span className="text-[#e85514]">可領取</span> , 單筆最高金額 <span className="text-[#e85514]">490000</span>
          </p>
          <p className="text-[12px] leading-relaxed text-[#7a7d84]">
            今日提現次數剩: <span className="text-[#e85514]">5次</span> , 可提現額度剩: <span className="text-[#e85514]">0</span>
          </p>

          <button type="button" className="my-5 h-[44px] w-full rounded-[4px] bg-[#eb5e1a] text-[14px] font-medium text-white">
            送出
          </button>
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
