"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import MobileSubPageHeader from "./MobileSubPageHeader";
import MobileEmptyState from "./MobileEmptyState";

type Props = { images: Record<string, string | null> };

const DATE_RANGES = ["今日", "昨日", "近7日", "近15日", "近30日"];

const TABS = [
  { key: "transaction", label: "交易明細" },
  { key: "transfer", label: "轉點明細" },
  { key: "activity", label: "活動點數" },
  { key: "mall", label: "商城點數" },
  { key: "other", label: "其他明細" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// 帳戶明細 — confirmed live: 5 of the page's 6 menu sub-items (交易明細/轉點
// 明細/活動點數/商城點數/其他明細) are not separate pages, just deep-links
// (via a query param) into one shared page with its own tab switcher; only
// 投注記錄 is a genuinely separate page (see MobileBetHistoryScreen). The
// `?tab=` param lets MobileMyScreen's menu links land directly on the right
// tab instead of always opening to 交易明細.
function AccountDetailContent({ images }: Props) {
  const params = useSearchParams();
  const initialTab = (TABS.find((t) => t.key === params.get("tab"))?.key ?? "transaction") as TabKey;
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]);
  const [showDateMenu, setShowDateMenu] = useState(false);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="帳戶明細" images={images} />

      <div className="flex-shrink-0 overflow-x-auto bg-white">
        <div className="flex h-10 min-w-max items-center px-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex h-10 flex-1 items-center justify-center whitespace-nowrap border-b-[3px] px-3 text-[13px] font-bold ${
                tab === t.key ? "border-[#eb5e1a] text-[#eb5e1a]" : "border-transparent text-black"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center justify-end bg-[#f0eff5] px-4 py-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDateMenu((v) => !v)}
            className="flex h-7 items-center gap-1 rounded-[4px] border border-black/15 bg-white px-2 text-[12px] text-black/70"
          >
            📅 {dateRange}
          </button>
          {showDateMenu ? (
            <div className="absolute right-0 top-full z-10 mt-1 w-[110px] overflow-hidden rounded-[4px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              {DATE_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setDateRange(range);
                    setShowDateMenu(false);
                  }}
                  className={`block w-full border-b border-black/[0.06] px-3 py-2 text-left text-[12px] last:border-b-0 ${
                    range === dateRange ? "font-bold text-black" : "text-black/70"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto bg-white" onClick={() => setShowDateMenu(false)}>
        <MobileEmptyState images={images} />
      </div>
    </div>
  );
}

export default function MobileAccountDetailScreen({ images }: Props) {
  return (
    <Suspense fallback={null}>
      <AccountDetailContent images={images} />
    </Suspense>
  );
}
