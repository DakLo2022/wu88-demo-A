"use client";

import { useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import MobileBottomNav from "./MobileBottomNav";

type Props = { images: Record<string, string | null> };

// Prefers whichever was actually uploaded — the mobile-specific image
// (stored under the "__mobile" key when uploaded via the "手機" tab in
// /image-manager) or the plain/desktop one. Same fix as every other
// mobile-only component in this project.
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

// Confirmed live on wu88.live/trade.
const DATE_RANGES = ["今日", "昨日", "近7日", "近15日", "近30日"];
const TYPE_OPTIONS = ["全部", "儲值", "託售"];

// 帳務 (account/billing) page — reached via the bottom tab bar's 帳務 tab.
// Confirmed live against wu88.live/trade:
//   - header: back arrow + centered "帳戶" title (NOT "帳務" — the tab label
//     and the page title genuinely differ) on the standard brand gradient,
//     plus a right-side "今日" date-range button that opens a 5-option
//     dropdown (今日/昨日/近7日/近15日/近30日, 今日 selected by default).
//   - this header does NOT have an extended toolbar section (unlike the
//     優惠 page's header) — the filter row below is part of the scrollable
//     content area, not the header itself.
//   - filter row: a "選擇類型" multi-select checkbox dropdown (全部/儲值/
//     託售, all checked by default — the closed box's label lists whichever
//     are currently checked) on the left, and 未完成/已完成 tabs on the
//     right. Confirmed live: 未完成 is selected by default (orange text +
//     3px orange underline), 已完成 inactive (black text, no underline) —
//     exact same active/inactive treatment as every other tab pair already
//     built in this project.
//   - content: the real site's test account had no matching records under
//     either tab, so this always renders the empty state (illustration +
//     "暫無相關資料") — matching the fake-auth "no real backend" convention
//     used everywhere else in this demo.
export default function MobileTradeScreen({ images }: Props) {
  const [activeTab, setActiveTab] = useState<"未完成" | "已完成">("未完成");
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [checkedTypes, setCheckedTypes] = useState<string[]>(TYPE_OPTIONS);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const dateIconSrc = pickImage(images, "mobile-trade-date-icon");
  const typeArrowSrc = pickImage(images, "mobile-trade-type-arrow");
  const emptyIllustrationSrc = pickImage(images, "mobile-trade-empty-illustration");
  const checkIconSrc = pickImage(images, "mobile-trade-checkbox-check-icon");
  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");

  function toggleType(option: string) {
    setCheckedTypes((prev) =>
      prev.includes(option) ? prev.filter((t) => t !== option) : [...prev, option],
    );
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
        <h1 className="flex-1 text-center text-[18px]">帳戶</h1>

        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowDateMenu((v) => !v)}
            className="flex h-8 items-center gap-1 px-1 text-[13px] text-white"
          >
            {dateIconSrc ? (
              <MaskIcon src={dateIconSrc} className="h-4 w-4 flex-shrink-0 bg-white" />
            ) : (
              <span aria-hidden className="text-sm leading-none">📅</span>
            )}
            {dateRange}
          </button>

          {showDateMenu ? (
            <div className="absolute right-0 top-full z-10 w-[110px] overflow-hidden rounded-[4px] bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              {DATE_RANGES.map((range) => {
                const active = range === dateRange;
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setDateRange(range);
                      setShowDateMenu(false);
                    }}
                    className={`block w-full border-b border-black/[0.06] px-3 py-2.5 text-left text-[13px] last:border-b-0 ${
                      active ? "font-bold text-black" : "text-black/70"
                    }`}
                  >
                    {range}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </header>

      <div className="flex-shrink-0 bg-white">
        <div className="flex h-10 items-center">
          <div className="relative ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowTypeMenu((v) => !v)}
              className="flex h-[25px] items-center rounded-[4px] border border-[#c6c6ca] bg-white pl-2 pr-2 text-[12px] text-black/80"
            >
              選擇類型
              {typeArrowSrc ? (
                <MaskIcon
                  src={typeArrowSrc}
                  className={`ml-1 block h-3 w-3 flex-shrink-0 bg-current transition-transform ${
                    showTypeMenu ? "rotate-180" : ""
                  }`}
                />
              ) : (
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className={`ml-1 h-3 w-3 transition-transform ${showTypeMenu ? "rotate-180" : ""}`}
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              )}
            </button>

            {showTypeMenu ? (
              <div className="absolute left-0 top-full z-10 mt-1 w-[110px] overflow-hidden rounded-[4px] bg-white py-1 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                {TYPE_OPTIONS.map((option) => {
                  const checked = checkedTypes.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleType(option)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-black/80"
                    >
                      <span
                        aria-hidden
                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[3px] border ${
                          checked ? "border-[#eb5e1a] bg-[#eb5e1a]" : "border-black/30 bg-white"
                        }`}
                      >
                        {checked ? (
                          checkIconSrc ? (
                            <MaskIcon src={checkIconSrc} className="h-3 w-3 bg-white" />
                          ) : (
                            <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )
                        ) : null}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("未完成")}
            className={`flex h-10 flex-1 items-center justify-center border-b-[3px] text-[14px] font-bold ${
              activeTab === "未完成" ? "border-[#eb5e1a] text-[#eb5e1a]" : "border-transparent text-black"
            }`}
          >
            未完成
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("已完成")}
            className={`flex h-10 flex-1 items-center justify-center border-b-[3px] text-[14px] font-bold ${
              activeTab === "已完成" ? "border-[#eb5e1a] text-[#eb5e1a]" : "border-transparent text-black"
            }`}
          >
            已完成
          </button>
        </div>
      </div>

      <div
        className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-6"
        onClick={() => {
          setShowDateMenu(false);
          setShowTypeMenu(false);
        }}
      >
        {emptyIllustrationSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={emptyIllustrationSrc} alt="" className="h-auto w-[300px] object-contain opacity-80" />
        ) : (
          <span aria-hidden className="text-6xl opacity-60">
            📭
          </span>
        )}
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
