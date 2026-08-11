"use client";

import { useRef, useState } from "react";
import { mobileSlotKey } from "@/lib/imageTransform";
import MobileSubPageHeader from "./MobileSubPageHeader";
import { MOBILE_VIP_TIERS } from "@/data/mobileMy";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

const TIER_ICONS: Record<string, string> = {
  銅: "🥉",
  銀: "🥈",
  金: "🥇",
  白金: "🔷",
  鑽: "💎",
  金鑽: "✨",
  鬼推磨: "🌀",
  聚寶盆: "🏺",
  搖錢樹: "🌳",
  財神: "🧧",
};

// The demo account's actual tier — matches the VIP1 badge shown on the 我的
// page's own profile card.
const CURRENT_TIER_IDX = 0;

function formatNumber(v: string): string {
  const n = Number(v);
  if (!Number.isFinite(n)) return v;
  return n.toLocaleString("en-US");
}

// 會員等級 (under 會員資料) — confirmed live at wu88.live/vip_level as its
// own distinct mobile page, NOT a shrunk-down copy of the desktop 會員等級
// tab (which uses a totally different hero/table layout). Rebuilt to match
// what's actually on the mobile site:
//   - a fixed "your account" hero (orange decorative background, its own
//     upload slot since the real background is a baked-in PNG, not a CSS
//     gradient) showing username + current tier pill + a progress bar
//     between the current/next tier badges + 所需流水/等級有效流水 lines —
//     this section never changes as you browse other tiers below.
//   - a horizontal tier stepper (confirmed live to double as the swiper
//     dots for the card beneath it — tapping a chip both highlights it and
//     changes the card).
//   - a swipeable gold card ("VIPn 名稱" + 累積儲值積分/流水需求 stats,
//     "當前等級" label only shown on the account's real tier) with an "n/10"
//     counter below it.
//   - a white stat section (💳 每日託售次數／👛 每日點數託售額度／🎁 升級獎金／
//     🎂 生日禮) for whichever tier is currently selected in the stepper —
//     every field here was directly confirmed live across all 10 tiers
//     (每日託售次數/每日點數託售額度 turned out to be a fixed "1次"/"1000000"
//     for every tier, not scaled as previously assumed).
export default function MobileVipLevelScreen({ images }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(CURRENT_TIER_IDX);
  const current = MOBILE_VIP_TIERS[CURRENT_TIER_IDX];
  const next = MOBILE_VIP_TIERS[Math.min(CURRENT_TIER_IDX + 1, MOBILE_VIP_TIERS.length - 1)];
  const selected = MOBILE_VIP_TIERS[selectedIdx];

  const cardScrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Tracks whether the last index change came from the user tapping a
  // stepper chip (which we then smooth-scroll to) vs. dragging the card row
  // itself — avoids the onScroll handler fighting the smooth-scroll while
  // it's still animating toward the tapped card.
  const isProgrammaticScroll = useRef(false);

  function goToSlide(idx: number) {
    setSelectedIdx(idx);
    isProgrammaticScroll.current = true;
    cardRefs.current[idx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 400);
  }

  function handleCardScroll() {
    if (isProgrammaticScroll.current) return;
    const el = cardScrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(MOBILE_VIP_TIERS.length - 1, idx));
    setSelectedIdx((prev) => (prev === clamped ? prev : clamped));
  }

  const heroBgSrc = pickImage(images, "mobile-vip-hero-bg");
  const badgeCurrentSrc = pickImage(images, "mobile-my-tier-badge-current");
  const badgeNextSrc = pickImage(images, "mobile-my-tier-badge-next");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader
        title="會員等級"
        images={images}
        backHref="/my"
        right={<span aria-hidden className="text-[16px]">🎖️</span>}
      />

      <div className="flex-1 overflow-y-auto bg-white">
        {/* Fixed hero — the visitor's actual account status, doesn't change
            while browsing other tiers below. */}
        <div
          className="relative overflow-hidden bg-brand-accent bg-cover bg-center px-4 pb-4 pt-4 text-white"
          style={heroBgSrc ? { backgroundImage: `url(${heroBgSrc})` } : undefined}
        >
          {!heroBgSrc ? <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ffb84d] to-[#ff8a1f]" /> : null}

          <div className="flex items-center gap-2 text-[16px]">
            {"Heather003"}
            <span className="rounded-[3px] bg-white px-[6px] py-[1px] text-[12px] font-bold text-[#ea5b19]">
              {current.tier}
              {current.name}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex w-10 flex-shrink-0 flex-col items-center gap-1">
              {badgeCurrentSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={badgeCurrentSrc} alt="" className="h-9 w-9 object-contain" />
              ) : (
                <span className="text-2xl leading-none">🥉</span>
              )}
              <span className="text-[11px] leading-none">
                {current.tier} {current.name}
              </span>
            </div>
            <div className="h-[8px] flex-1 overflow-hidden rounded-full bg-[#ffebcc]">
              <div className="h-full w-0 rounded-full bg-[#fccc83]" />
            </div>
            <div className="flex w-10 flex-shrink-0 flex-col items-center gap-1">
              {badgeNextSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={badgeNextSrc} alt="" className="h-9 w-9 object-contain" />
              ) : (
                <span className="text-2xl leading-none">🥈</span>
              )}
              <span className="text-[11px] leading-none">
                {next.tier} {next.name}
              </span>
            </div>
          </div>

          <div className="mt-2 text-[12px]">
            ⓘ 所需流水: {formatNumber(next.turnoverRequired)}, 晉級至{next.tier}
          </div>
          <div className="mt-1 text-[12px]">等級有效流水: 0</div>
        </div>

        {/* Tier stepper — placement logic matches the desktop 會員等級 tab's
            own stepper exactly: each column pairs a neutral name pill (top)
            with a "VIPn" level pill (bottom, colored only when selected),
            so 等級 (level number) and 名稱 (tier name) stay visually
            distinct instead of being merged into one label. Tapping a
            column scrolls the card row below to that tier. */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-3">
          {MOBILE_VIP_TIERS.map((t, idx) => (
            <button
              key={t.tier}
              type="button"
              onClick={() => goToSlide(idx)}
              className="flex w-[60px] flex-shrink-0 flex-col items-center gap-1"
            >
              <span className="flex w-full items-center justify-center gap-1 rounded-[3px] bg-[#fff6df] py-1.5 text-[12px] text-black/70">
                <span aria-hidden>{TIER_ICONS[t.name]}</span> {t.name}
              </span>
              <span
                className={`w-full rounded-[3px] py-1 text-center text-[11px] font-medium transition-colors ${
                  idx === selectedIdx ? "bg-[#ff9800] text-white" : "bg-black/5 text-black/40"
                }`}
              >
                {t.tier}
              </span>
            </button>
          ))}
        </div>

        {/* Draggable gold-card carousel — a real horizontally-scrolling,
            snap-to-card row so it can be swiped left/right by hand (native
            touch drag), not just tapped through via the stepper above. The
            onScroll handler keeps the stepper + stat section below in sync
            with whichever card the user actually drags to. */}
        <div className="pb-2 pt-1">
          <div
            ref={cardScrollerRef}
            onScroll={handleCardScroll}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          >
            {MOBILE_VIP_TIERS.map((t, idx) => (
              <div
                key={t.tier}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="w-full flex-shrink-0 snap-center px-4"
              >
                <div
                  className="relative overflow-hidden rounded-[10px] p-4"
                  style={{ background: "linear-gradient(to right bottom, #ffdd3c, #ffffff, #fff2b2)" }}
                >
                  {idx === CURRENT_TIER_IDX ? (
                    <span className="absolute left-0 top-0 rounded-br-[8px] rounded-tl-[8px] bg-black/30 px-2 py-0.5 text-[11px] text-white">
                      當前等級
                    </span>
                  ) : null}
                  <p className="text-[22px] italic text-black/80">
                    {t.tier} {t.name}
                  </p>
                  <div className="mt-3 flex items-center gap-8">
                    <div>
                      <p className="text-[18px] font-bold text-black/80">0</p>
                      <p className="text-[11px] text-black/50">累積儲值積分</p>
                    </div>
                    <div>
                      <p className="text-[18px] font-bold text-black/80">{formatNumber(t.turnoverRequired)}</p>
                      <p className="text-[11px] text-black/50">流水需求</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[12px] text-black/35">
            {selectedIdx + 1}/{MOBILE_VIP_TIERS.length}
          </p>
        </div>

        {/* Stat grid for whichever tier is selected above. */}
        <div className="px-4 pb-6">
          <div className="mb-2 flex items-center gap-2">
            <span aria-hidden className="h-3.5 w-[3px] flex-shrink-0 rounded-full bg-[#eb5e1a]" />
            <span className="text-[14px] font-medium text-black">
              {selected.tier} {selected.name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {[
              { icon: "💳", value: selected.dailyConsignCount, label: "每日託售次數" },
              { icon: "👛", value: formatNumber(selected.dailyConsignLimit), label: "每日點數託售額度" },
              { icon: "🎁", value: selected.upgradeBonus, label: "升級獎金", note: "(晉級自動存入)" },
              { icon: "🎂", value: selected.birthdayBonus, label: "生日禮", note: "(聯絡客服發送)" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <span aria-hidden className="text-[22px] leading-none">{stat.icon}</span>
                <div>
                  <p className="text-[15px] font-bold text-[#eb5e1a]">{stat.value}</p>
                  <p className="text-[11px] leading-tight text-black/45">
                    {stat.label}
                    {stat.note ? <span className="block">{stat.note}</span> : null}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
