"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";
import MobileEmptyState from "./MobileEmptyState";

type Props = { images: Record<string, string | null> };

const DATE_RANGES = ["今日", "昨日", "近7日", "近15日", "近30日"];
const GAME_TYPES = ["全部", "體育", "真人", "電子", "彩票", "棋牌"];

const STATS = [
  { label: "總投注", value: "0" },
  { label: "總有效投注", value: "0" },
  { label: "總輸贏", value: "0" },
  { label: "總筆數", value: "0" },
];

// 投注記錄 — confirmed live as its own dedicated page (unlike the other 5
// 帳戶明細 sub-items, which are deep-links into one shared page). Two
// filters (遊戲類型/日期範圍) above an empty results list, with a 4-stat
// summary footer — same "no real backend data" convention used by the
// 帳務/帳戶明細 empty states elsewhere in this project.
export default function MobileBetHistoryScreen({ images }: Props) {
  const [gameType, setGameType] = useState(GAME_TYPES[0]);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]);
  const [showDateMenu, setShowDateMenu] = useState(false);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="投注記錄" images={images} />

      <div className="flex flex-shrink-0 items-center gap-2 bg-[#f0eff5] px-4 py-2.5">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setShowTypeMenu((v) => !v)}
            className="flex h-8 w-full items-center justify-between rounded-[4px] border border-black/15 bg-white px-2.5 text-[13px] text-black/80"
          >
            {gameType}
            <span aria-hidden className={`text-[10px] transition-transform ${showTypeMenu ? "rotate-180" : ""}`}>▾</span>
          </button>
          {showTypeMenu ? (
            <div className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded-[4px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              {GAME_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setGameType(t);
                    setShowTypeMenu(false);
                  }}
                  className={`block w-full border-b border-black/[0.06] px-3 py-2 text-left text-[13px] last:border-b-0 ${
                    t === gameType ? "font-bold text-black" : "text-black/70"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setShowDateMenu((v) => !v)}
            className="flex h-8 w-full items-center justify-between rounded-[4px] border border-black/15 bg-white px-2.5 text-[13px] text-black/80"
          >
            📅 {dateRange}
            <span aria-hidden className={`text-[10px] transition-transform ${showDateMenu ? "rotate-180" : ""}`}>▾</span>
          </button>
          {showDateMenu ? (
            <div className="absolute right-0 top-full z-10 mt-1 w-full overflow-hidden rounded-[4px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              {DATE_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setDateRange(range);
                    setShowDateMenu(false);
                  }}
                  className={`block w-full border-b border-black/[0.06] px-3 py-2 text-left text-[13px] last:border-b-0 ${
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

      <div
        className="flex flex-1 flex-col overflow-y-auto bg-white"
        onClick={() => {
          setShowTypeMenu(false);
          setShowDateMenu(false);
        }}
      >
        <MobileEmptyState images={images} />
      </div>

      <div className="grid flex-shrink-0 grid-cols-4 gap-px bg-black/10">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-0.5 bg-white py-2.5">
            <span className="text-[11px] text-black/45">{s.label}</span>
            <span className="text-[13px] font-medium text-black/80">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
