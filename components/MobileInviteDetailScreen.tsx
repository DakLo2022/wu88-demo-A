"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";
import { INVITE_FRIEND_TURNOVER_ROWS } from "@/data/mobileMy";

type Props = { images: Record<string, string | null> };

const STATS = [
  { key: "today", label: "今邀人數：", value: "0" },
  { key: "total", label: "邀請總人數：", value: "6" },
  { key: "invalid", label: "失效人數：", value: "0" },
];

// 邀請詳情 (/my/invite/detail) — confirmed live at wu88.live/invite_friend/
// detail to be its own separate route (not a client-side tab of the main
// 邀請好友 page). Has 2 in-page sub-tabs: 好友首存禮金 (confirmed live to be
// empty) and 好友流水分成 (confirmed live to have 6 real demo rows, all
// reproduced verbatim — plain functional account/turnover data, not
// creative content).
export default function MobileInviteDetailScreen({ images }: Props) {
  const [tab, setTab] = useState<"deposit" | "turnover">("deposit");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="邀請詳情" images={images} backHref="/my/invite" />

      <div className="flex flex-shrink-0 bg-white">
        {(
          [
            { key: "deposit" as const, label: "好友首存禮金" },
            { key: "turnover" as const, label: "好友流水分成" },
          ]
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex h-11 flex-1 items-center justify-center border-b-2 text-[14px] font-bold ${
              tab === t.key ? "border-[#eb5e1a] text-[#eb5e1a]" : "border-transparent text-black/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-[#f0eff5] px-3 py-3">
        <p className="mb-2 text-[12px] text-black/50">累積發放獎勵: 0</p>

        <div className="grid grid-cols-3 gap-2">
          {STATS.map((s) => (
            <div key={s.key} className="overflow-hidden rounded-[6px] bg-white">
              <div className="bg-[#eb5e1a] px-1.5 py-1.5 text-center text-[11px] text-white">{s.label}</div>
              <div className="py-2 text-center text-[15px] font-bold text-[#eb5e1a]">{s.value}</div>
            </div>
          ))}
        </div>

        {tab === "deposit" ? (
          <>
            <div className="mt-4 flex items-center justify-between text-[13px] text-black/70">
              <span>首存禮金: 0</span>
              <div className="flex gap-2">
                <span className="rounded-[4px] border border-black/15 bg-white px-2.5 py-1 text-[12px] text-black/60">帳號</span>
                <span className="rounded-[4px] border border-black/15 bg-white px-2.5 py-1 text-[12px] text-black/60">今日邀請 ▾</span>
              </div>
            </div>

            <div className="mt-2 overflow-hidden rounded-[6px] bg-white">
              <table className="w-full text-center text-[11px]">
                <thead>
                  <tr className="border-b border-black/[0.06] text-black/50">
                    <th className="px-1 py-2.5 font-normal">註冊時間</th>
                    <th className="px-1 py-2.5 font-normal">首存時間</th>
                    <th className="px-1 py-2.5 font-normal">首存金額</th>
                    <th className="px-1 py-2.5 font-normal">獎勵金額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="py-6 text-black/35">
                      查無資料
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="mt-4 flex items-center justify-between text-[13px] text-black/70">
              <span>好友流水分成 : 0</span>
              <span className="rounded-[4px] border border-black/15 bg-white px-2.5 py-1 text-[12px] text-black/60">帳號</span>
            </div>

            <div className="mt-2 overflow-hidden rounded-[6px] bg-white">
              <table className="w-full text-center text-[11px]">
                <thead>
                  <tr className="border-b border-black/[0.06] text-black/50">
                    <th className="px-1 py-2.5 font-normal">註冊時間</th>
                    <th className="px-1 py-2.5 font-normal">有效流水</th>
                    <th className="px-1 py-2.5 font-normal">未領分成</th>
                    <th className="px-1 py-2.5 font-normal">已領分成</th>
                  </tr>
                </thead>
                <tbody>
                  {INVITE_FRIEND_TURNOVER_ROWS.map((row) => (
                    <tr key={row.name} className="border-b border-black/[0.05] last:border-b-0">
                      <td className="px-1 py-2 text-left text-[#eb5e1a]">
                        <span className="pl-2">{row.name}</span>
                        <br />
                        <span className="pl-2 text-black/40">{row.registeredAt}</span>
                      </td>
                      <td className="px-1 py-2 text-black/70">{row.effectiveTurnover}</td>
                      <td className="px-1 py-2 text-black/70">{row.unclaimed}</td>
                      <td className="px-1 py-2 text-black/70">{row.claimed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
