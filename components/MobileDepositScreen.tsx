"use client";

import { useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
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

const METHODS = [
  { id: "bank", label: "銀行轉點(第三方)", iconSlot: "mobile-deposit-method-bank-icon", fallbackEmoji: "🏦" },
  { id: "usdt", label: "USDT", iconSlot: "mobile-deposit-method-usdt-icon", fallbackEmoji: "🪙" },
] as const;

const QUICK_AMOUNTS = [100, 500, 1000, 3000, 5000, 10000, 15000, 20000];

// USDT-only exchange rate, confirmed live via getComputedStyle on
// wu88.live/deposit after selecting the USDT payment card.
const USDT_RATE = 32.4;

const NOTICES = [
  {
    title: "✅銀行卡儲值注意事項",
    items: [
      "採實名制，限定「綁定在平台的帳戶」進行儲值",
      "不支持ATM現金存入及電子支付軟件轉帳",
      "轉帳切勿進行任何備註，設置備註將一律退款",
      "匯款金額必須與提單金額完全相符",
      "不可自行重複轉帳到我方之收款帳號",
      "如使用以上錯誤方式轉帳，退款需等候3-7個工作天",
    ],
  },
  {
    title: "✅USDT儲值注意事項",
    items: [
      "交易所會收取單筆手續費",
      "扣除手續費金額務必與提單金額相符",
      "輸入的金額為USDT【顆數】",
      "建議使用冷錢包，避免風控",
    ],
  },
  {
    title: "✅超商儲值注意事項",
    items: [
      "需使用設置的門市進行繳費，僅支持設置一間門市　如：綁定全家新竹新美店，將僅能透過此間門市繳費儲值",
      "使用非設置門市繳費，將導致系統無法自動上分",
    ],
  },
  {
    title: "✅支付寶儲值注意事項",
    items: [
      "自動換算人民幣，超過200元會有3%手續費",
      "使用支付寶餘額轉帳，無須收取手續費",
      "每卡可綁3帳號，每帳號最多刷15000 RMB",
      "如要提高額度，需用台胞證完成支付寶實名認證",
      "支持信用卡(VISA / Master / JCB)",
    ],
  },
];

// 儲值 (/deposit) — reached via 存提 popup's 儲值 button. Confirmed live on
// wu88.live/deposit:
//   - header: standard back-arrow + centered "儲值" title on the brand
//     gradient (same 50px header used everywhere else in this project).
//   - "點數錢包支付方式" section heading + "點數餘額: 0" on the right, then
//     TWO full-width stacked payment-method cards (373px wide, 56px tall,
//     white bg, radius 4px, icon-over-label layout — confirmed live via
//     querying `.choice-deposit-tab`, NOT a side-by-side pair as a first
//     glance might suggest): 銀行轉點(第三方) and USDT.
//   - "儲值金額" section: 8 quick-amount buttons in a wrapping grid
//     (confirmed live: bg #d9d9d9, radius 4px, ~84×36, grey #4b4b4b 12px
//     bold text) plus a manual amount field.
//   - 銀行轉點(第三方) and USDT are NOT the same form below this point —
//     re-checked live, USDT selected adds 3 things bank doesn't have:
//     (1) an exchange-rate + flow-link row right under the 儲值金額 heading
//     ("1USDT : 32.4" in red 16px/500, plus a "點我看USDT儲值流程" link in
//     orange #e06018 12px/500), (2) a "存款限額 10～500000 可得 0" grey
//     #808182 12.8px line under the amount field, and (3) a "選擇付款通道"
//     section after the amount field with a selected TRC20 channel card
//     (flat #eb5e1a, radius 4px, white bold text + a "(限額 10-500000
//     USDT)" white bold subtext) — none of which render for 銀行轉點(第三方).
//   - 立即儲值 submit button: full-width, flat #eb5e1a, white 16px/500 text
//     (confirmed live via getComputedStyle).
//   - below the button: 4 real notice sections (銀行卡/USDT/超商/支付寶儲值
//     注意事項) — all 4 render even though only 2 payment methods are
//     currently selectable, confirmed live these notices are always shown
//     as reference regardless of which methods are actually enabled.
export default function MobileDepositScreen({ images }: Props) {
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("bank");
  const [amount, setAmount] = useState("");

  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");

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
        <h1 className="flex-1 text-center text-[18px]">儲值</h1>
        <span className="h-8 w-8 flex-shrink-0" aria-hidden />
      </header>

      <div className="flex-1 overflow-y-auto bg-white px-3 pb-8 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-semibold text-[#202020]">點數錢包支付方式</span>
          <span className="text-[12px] text-black/50">點數餘額: 0</span>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {METHODS.map((m) => {
            const iconSrc = pickImage(images, m.iconSlot);
            const active = method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`flex h-[56px] flex-col items-center justify-center gap-1 rounded-[4px] border bg-white ${
                  active ? "border-[#eb5e1a]" : "border-black/10"
                }`}
              >
                {iconSrc ? (
                  <img src={iconSrc} alt="" className="h-6 w-6 object-contain" />
                ) : (
                  <span className="text-xl leading-none">{m.fallbackEmoji}</span>
                )}
                <span className={`text-[12px] font-bold ${active ? "text-[#eb5e1a]" : "text-[#4b4b4b]"}`}>{m.label}</span>
              </button>
            );
          })}
        </div>

        <h2 className="mt-5 text-[16px] font-semibold text-[#202020]">儲值金額</h2>

        {method === "usdt" ? (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[16px] font-medium text-[#ff0000]">1USDT : {USDT_RATE}</span>
            <button type="button" className="text-[12px] font-medium text-[#e06018] underline">
              點我看USDT儲值流程
            </button>
          </div>
        ) : null}

        <div className="mt-2 flex flex-wrap">
          {QUICK_AMOUNTS.map((v) => {
            const active = amount === String(v);
            return (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(String(v))}
                className={`m-1 h-[36px] w-[84px] rounded-[4px] text-[12px] font-bold ${
                  active ? "bg-[#eb5e1a] text-white" : "bg-[#d9d9d9] text-[#4b4b4b]"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex h-[40px] items-center rounded-[4px] border border-black/10">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="請輸入儲值金額"
            inputMode="numeric"
            className="h-full flex-1 rounded-[4px] px-3 text-[13px] text-black placeholder:text-black/30 focus:outline-none"
          />
        </div>

        {method === "usdt" ? (
          <p className="ml-1 mt-1 text-[12.8px] text-[#808182]">
            存款限額 10～500000 可得 {amount ? (Number(amount) * USDT_RATE).toLocaleString() : 0}
          </p>
        ) : null}

        {method === "usdt" ? (
          <>
            <p className="mx-5 mt-4 text-center text-[16px] font-bold text-[#656971]">選擇付款通道</p>
            <div className="mt-2 flex h-[40px] items-center justify-between rounded-[4px] bg-[#eb5e1a] px-4">
              <span className="text-[14.4px] font-bold text-white">TRC20</span>
              <span className="text-[14px] font-bold text-white">(限額 10-500000 USDT)</span>
            </div>
          </>
        ) : null}

        <button type="button" className="mt-4 h-[44px] w-full rounded-[4px] bg-[#eb5e1a] text-[16px] font-medium text-white">
          立即儲值
        </button>

        <div className="mt-6 flex flex-col gap-4">
          {NOTICES.map((notice) => (
            <div key={notice.title}>
              <p className="text-[13px] font-bold text-[#4b4b4b]">{notice.title}</p>
              <ul className="mt-1 flex flex-col gap-1">
                {notice.items.map((item, i) => (
                  <li key={i} className="text-[12px] leading-relaxed text-black/40">
                    ▪️{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
