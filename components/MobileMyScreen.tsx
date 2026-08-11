"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import MobileBottomNav from "./MobileBottomNav";
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from "@/data/mobileMy";

// Formats a Date as the site's own GMT(+08:00) clock string, regardless of
// the visitor's actual local timezone — matches the live site's live-
// ticking timestamp row under the profile card.
function formatGmt8(date: Date): string {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  const gmt8 = new Date(utcMs + 8 * 60 * 60000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${gmt8.getFullYear()}-${pad(gmt8.getMonth() + 1)}-${pad(gmt8.getDate())} ${pad(gmt8.getHours())}:${pad(gmt8.getMinutes())}:${pad(gmt8.getSeconds())} GMT(+08:00)`;
}

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

// Bottom-sheet option list shared by the 語系切換/時區設定 rows — confirmed
// live these two are inline pickers, not separate pages (unlike every other
// 帳戶明細/會員資料/協助中心 sub-item), so they're modals here instead of
// routes.
function OptionSheet({
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  title: string;
  options: readonly string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end bg-black/40" onClick={onClose}>
      <div
        className="max-h-[70vh] w-full overflow-hidden rounded-t-[14px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-12 flex-shrink-0 items-center justify-center border-b border-black/[0.06] text-[15px] font-medium text-black">
          {title}
        </div>
        <div className="max-h-[calc(70vh-48px)] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onSelect(opt);
                onClose();
              }}
              className={`flex h-[46px] w-full items-center justify-between border-b border-black/[0.05] px-5 text-[14px] last:border-b-0 ${
                opt === selected ? "font-bold text-[#eb5e1a]" : "text-black/75"
              }`}
            >
              {opt}
              {opt === selected ? <span aria-hidden>✓</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type SubItem = { label: string; href?: string; action?: "language" | "timezone" };

type MenuRow = {
  key: string;
  label: string;
  iconSlot: string;
  fallbackEmoji: string;
  href?: string;
  subItems?: SubItem[];
};

// Confirmed live against wu88.live/menu (accessed via the "我" bottom tab).
// Sub-items for the 3 dropdown rows were confirmed by dispatching real
// click events at the live `.v-list-group__header` elements and reading
// the resulting accessibility tree. The "App" row that appears after
// 協助中心 on the live site is deliberately left out here per explicit
// request ("把app按鈕收掉").
//
// Destinations below were confirmed by researching each target live and are
// wired as real navigation here:
//   - 綁定帳戶/投注彩金/邀請好友/安全中心 each go to their own "second-layer"
//     page (none of which render <MobileBottomNav>, an explicit override of
//     what the live site itself does on some of these routes).
//   - 帳戶明細's sub-items: 5 of the 6 (交易明細/轉點明細/活動點數/商城點數/
//     其他明細) are deep-links (via ?tab=) into one shared page; 投注記錄 is
//     confirmed to be a genuinely separate page.
//   - 會員資料's sub-items: 帳戶管理/會員等級 are real sub-pages; 語系切換/
//     時區設定 are inline bottom-sheet pickers on the real site, reproduced
//     as OptionSheet above rather than routes.
//   - 協助中心's sub-items each go to their own tutorial/content page,
//     reusing the same FAQ/legal/step-tutorial content already built for
//     the desktop 協助中心 modal where the two overlap.
const MENU_ROWS: MenuRow[] = [
  { key: "bind-account", label: "綁定帳戶", iconSlot: "mobile-my-icon-bind-account", fallbackEmoji: "💳", href: "/my/bind-account" },
  {
    key: "account-detail",
    label: "帳戶明細",
    iconSlot: "mobile-my-icon-account-detail",
    fallbackEmoji: "📋",
    subItems: [
      { label: "交易明細", href: "/my/account-detail?tab=transaction" },
      { label: "轉點明細", href: "/my/account-detail?tab=transfer" },
      { label: "投注記錄", href: "/my/bet-history" },
      { label: "活動點數", href: "/my/account-detail?tab=activity" },
      { label: "商城點數", href: "/my/account-detail?tab=mall" },
      { label: "其他明細", href: "/my/account-detail?tab=other" },
    ],
  },
  {
    key: "member-info",
    label: "會員資料",
    iconSlot: "mobile-my-icon-member-info",
    fallbackEmoji: "🧑",
    subItems: [
      { label: "帳戶管理", href: "/my/account-manage" },
      { label: "語系切換", action: "language" },
      { label: "時區設定", action: "timezone" },
      { label: "會員等級", href: "/my/vip-level" },
    ],
  },
  { key: "bet-bonus", label: "投注彩金", iconSlot: "mobile-my-icon-bet-bonus", fallbackEmoji: "⭐", href: "/my/bet-bonus" },
  { key: "invite", label: "邀請好友", iconSlot: "mobile-my-icon-invite", fallbackEmoji: "👥", href: "/my/invite" },
  { key: "security", label: "安全中心", iconSlot: "mobile-my-icon-security", fallbackEmoji: "🛡️", href: "/my/security" },
  {
    key: "help",
    label: "協助中心",
    iconSlot: "mobile-my-icon-help",
    fallbackEmoji: "🎧",
    subItems: [
      { label: "常見問題", href: "/my/help/faq" },
      { label: "關於我們", href: "/my/help/about" },
      { label: "USDT儲值流程", href: "/my/help/usdt" },
      { label: "超商查詢流程", href: "/my/help/store-search" },
      { label: "雲支付綁定流程", href: "/my/help/taiwan-pay" },
      { label: "支付寶綁定流程", href: "/my/help/alipay" },
    ],
  },
];

const QUICK_ACTIONS = [
  { label: "儲值", iconSlot: "mobile-my-icon-deposit", fallbackEmoji: "💰" },
  { label: "託售", iconSlot: "mobile-my-icon-consign", fallbackEmoji: "📤" },
  { label: "錢包", iconSlot: "mobile-my-icon-wallet", fallbackEmoji: "👛" },
];

// 我的 (My/profile) page — reached from the bottom tab bar's 我 button.
// Confirmed live against wu88.live/menu:
//   - header: back arrow + centered "我" title + a notification bell,
//     right-aligned — same header pattern as every other page, just with a
//     bell instead of the homepage's mail icon.
//   - profile card (15px side margin, 10px radius, 10px inner padding): the
//     real site's card background is its own mascot artwork (not
//     reproduced — its own upload slot, brand-gradient fallback), holding
//     username + white "VIPx 銅/銀" pill badge, a real-name line, "加入WU88
//     第N天", a tier progress bar (two round tier badges either side of a
//     pill track — track #FFEBCC, fill #FCCC83, both confirmed live), and
//     two turnover lines.
//   - below the card: a gray timestamp row with a small counter + refresh
//     icon, then a row of 3 icon buttons (儲值/託售/錢包) — these open the
//     real site's full deposit/withdrawal/wallet-transfer flows, which are
//     out of scope for this pass (not among the pages researched/requested)
//     and stay inert for now.
//   - the menu list: white 48px-tall rows, 16px icon indent, 20px icons.
//     帳戶明細/會員資料/協助中心 are real Vuetify `v-list-group` accordions
//     with a chevron that expands a set of bulleted sub-items inline (not a
//     separate page) — reproduced here as local per-row expand/collapse
//     state, one boolean per row so multiple can be open at once. Every
//     row/sub-item now navigates to a real second-layer page or opens an
//     inline picker, per the destinations documented above MENU_ROWS.
//   - 登出: full-width flat orange (#eb5e1a) button, no radius — routes back
//     to /login, matching what a real logout does.
export default function MobileMyScreen({ images }: Props) {
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState<Date | null>(null);
  const [language, setLanguage] = useState<string>(LANGUAGE_OPTIONS[0]);
  const [timezone, setTimezone] = useState<string>(DEFAULT_TIMEZONE);
  const [activeSheet, setActiveSheet] = useState<"language" | "timezone" | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function toggleRow(key: string) {
    setOpenRows((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");
  const bellIconSrc = pickImage(images, "mobile-my-bell-icon");
  const profileBgSrc = pickImage(images, "mobile-my-profile-bg");
  const tierCurrentSrc = pickImage(images, "mobile-my-tier-badge-current");
  const tierNextSrc = pickImage(images, "mobile-my-tier-badge-next");
  const refreshIconSrc = pickImage(images, "mobile-my-refresh-icon");
  const chevronSrc = pickImage(images, "mobile-my-list-chevron");
  const logoutIconSrc = pickImage(images, "mobile-my-icon-logout");

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
        <h1 className="flex-1 text-center text-[18px]">我</h1>
        <button type="button" aria-label="通知" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {bellIconSrc ? (
            <MaskIcon src={bellIconSrc} className="h-5 w-5 bg-white" />
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6v-5a7 7 0 0 0-5.5-6.84V3a1.5 1.5 0 0 0-3 0v1.16A7 7 0 0 0 5 11v5l-1.7 1.7A1 1 0 0 0 4 19.4h16a1 1 0 0 0 .7-1.7z" />
            </svg>
          )}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto bg-[#f0eff5] px-[15px] pt-[15px]">
        <div
          className="relative overflow-hidden rounded-[10px] bg-brand-accent bg-center bg-no-repeat p-[10px] text-white [background-size:100%_100%]"
          style={
            profileBgSrc
              ? { backgroundImage: `url(${profileBgSrc})` }
              : undefined
          }
        >
          {!profileBgSrc ? (
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-from to-brand-to" />
          ) : null}

          <div className="flex items-center gap-2">
            <span className="text-[18px]">Heather003</span>
            <span className="rounded-[3px] bg-white px-[5px] py-[1px] text-[13px] font-bold text-[#ea5b19]">VIP1 銅</span>
          </div>
          <div className="mt-1 text-[16px]">H</div>
          <div className="mt-1 text-[12px]">加入WU88 第864天</div>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex w-9 flex-shrink-0 flex-col items-center gap-1">
              {tierCurrentSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tierCurrentSrc} alt="VIP1 銅" className="h-10 w-9 object-contain" />
              ) : (
                <span className="text-2xl leading-none">🥉</span>
              )}
              <span className="text-[11px] leading-none">VIP1 銅</span>
            </div>
            <div className="h-[10px] w-[180px] flex-shrink-0 overflow-hidden rounded-full bg-[#ffebcc]">
              <div className="h-full w-0 rounded-full bg-[#fccc83]" />
            </div>
            <div className="flex w-9 flex-shrink-0 flex-col items-center gap-1">
              {tierNextSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tierNextSrc} alt="VIP2 銀" className="h-10 w-9 object-contain" />
              ) : (
                <span className="text-2xl leading-none">🥈</span>
              )}
              <span className="text-[11px] leading-none">VIP2 銀</span>
            </div>
          </div>

          <div className="mt-2 text-[12px]">所需流水: 60000, 晉級至 VIP2</div>
          <div className="mt-1 text-[12px]">等級有效流水: 0</div>
        </div>

        <div className="mt-2 rounded-[10px] bg-white px-3 pt-2 pb-3">
          <div className="flex h-[22px] items-center justify-between text-[12px] text-[#656971]">
            <span>{now ? formatGmt8(now) : ""}</span>
            <div className="flex items-center gap-1.5">
              <span>0</span>
              <button type="button" aria-label="刷新" className="flex h-4 w-4 items-center justify-center">
                {refreshIconSrc ? (
                  <MaskIcon src={refreshIconSrc} className="h-4 w-4 bg-[#656971]" />
                ) : (
                  <span className="text-xs leading-none">↻</span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-1 flex items-stretch justify-around">
            {QUICK_ACTIONS.map((action) => {
              const src = pickImage(images, action.iconSlot);
              return (
                <button key={action.label} type="button" className="flex flex-col items-center gap-1.5 text-[13px] text-black/80">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="h-6 w-6 object-contain" />
                  ) : (
                    <span className="text-2xl leading-none">{action.fallbackEmoji}</span>
                  )}
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 mb-3 overflow-hidden rounded-[10px]">
          {MENU_ROWS.map((row) => {
            const iconSrc = pickImage(images, row.iconSlot);
            const isOpen = !!openRows[row.key];
            const rowIcon = iconSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={iconSrc} alt="" className="h-5 w-5 flex-shrink-0 object-contain" />
            ) : (
              <span className="w-5 flex-shrink-0 text-center text-lg leading-none">{row.fallbackEmoji}</span>
            );

            return (
              <div key={row.key} className="mb-2 overflow-hidden rounded-[10px] bg-white last:mb-0">
                {row.subItems ? (
                  <button
                    type="button"
                    onClick={() => toggleRow(row.key)}
                    className="flex h-[48px] w-full items-center gap-3 px-4 text-[14px] text-black/[0.87]"
                  >
                    {rowIcon}
                    <span className="flex-1 text-left">{row.label}</span>
                    {chevronSrc ? (
                      <MaskIcon
                        src={chevronSrc}
                        className={`h-4 w-4 flex-shrink-0 bg-black/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    ) : (
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        className={`h-4 w-4 flex-shrink-0 text-black/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="currentColor"
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    )}
                  </button>
                ) : (
                  <Link href={row.href ?? "#"} className="flex h-[48px] w-full items-center gap-3 px-4 text-[14px] text-black/[0.87]">
                    {rowIcon}
                    <span className="flex-1 text-left">{row.label}</span>
                  </Link>
                )}

                {row.subItems && isOpen ? (
                  <div>
                    {row.subItems.map((sub) => {
                      const subContent = (
                        <>
                          <span aria-hidden className="text-black/30">
                            •
                          </span>
                          <span className="flex-1">{sub.label}</span>
                          {sub.action ? (
                            <span className="text-[12px] text-black/40">
                              {sub.action === "language" ? language : timezone}
                            </span>
                          ) : null}
                        </>
                      );
                      const subClassName =
                        "flex h-[42px] w-full items-center gap-2 border-t border-black/[0.06] pl-[38px] pr-4 text-left text-[13px] text-black/60";
                      if (sub.action) {
                        return (
                          <button
                            key={sub.label}
                            type="button"
                            onClick={() => setActiveSheet(sub.action!)}
                            className={subClassName}
                          >
                            {subContent}
                          </button>
                        );
                      }
                      return (
                        <Link key={sub.label} href={sub.href ?? "#"} className={subClassName}>
                          {subContent}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <Link
          href="/login"
          className="mb-[48px] flex h-[48px] w-full items-center justify-center gap-2 bg-[#eb5e1a] text-[14px] text-white"
        >
          {logoutIconSrc ? (
            <MaskIcon src={logoutIconSrc} className="h-4 w-4 bg-white" />
          ) : (
            <span aria-hidden>⏻</span>
          )}
          登出
        </Link>
      </div>

      <MobileBottomNav images={images} />

      {activeSheet === "language" ? (
        <OptionSheet
          title="語系切換"
          options={LANGUAGE_OPTIONS}
          selected={language}
          onSelect={setLanguage}
          onClose={() => setActiveSheet(null)}
        />
      ) : null}
      {activeSheet === "timezone" ? (
        <OptionSheet
          title="時區設定"
          options={TIMEZONE_OPTIONS}
          selected={timezone}
          onSelect={setTimezone}
          onClose={() => setActiveSheet(null)}
        />
      ) : null}
    </div>
  );
}
