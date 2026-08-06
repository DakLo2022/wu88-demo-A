"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

// Real announcements pulled from pc.wu88.live/message's 公告專區 tab while
// logged in — each row expands inline (not exclusively; more than one can
// be open at once) to reveal a short body paragraph, rather than navigating
// to a separate detail page.
const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "【遊戲公告】MT體育上架",
    body: "🏆MT體育版火爆開盤｜熱門賽事任你選，一注定輸贏",
  },
  {
    id: 2,
    title: "【優惠公告】出款延遲補償金",
    body: "我們致力打造出、入款最速、安全的平台，讓各位會員們在使用上能有最好的遊戲體驗，因配合的廠商偶會有臨時維護的情況發生，故即刻起，只要您託售申請30分鐘後才入帳，即可於收到款項後24小時內與客服申請68點財神禮包！你的出款由武財神守護！",
  },
];

export default function MessageCenterModal({ open, onClose }: Props) {
  const [tab, setTab] = useState<"個人訊息" | "公告專區">("個人訊息");
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  if (!open) return null;

  const toggle = (id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-6 bg-gradient-to-b from-brand-from to-brand-to px-6 py-4 text-white">
        <h2 className="text-[20px] font-medium">消息中心</h2>
        <div className="flex gap-1">
          {(["個人訊息", "公告專區"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-[4px] px-4 py-2 text-[14px] transition-colors ${
                tab === t ? "bg-white font-medium text-[#eb5e1a]" : "text-white/85 hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          aria-label="關閉"
          className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
        >
          ✕
        </button>
      </div>

      {/* Very light orange-tinted page background (measured off the real
          site: rgba(235,94,26,0.063)), containing a plain white bordered
          card with the message table. */}
      <div className="flex-1 overflow-y-auto bg-[rgba(235,94,26,0.063)] px-6 py-6">
        <div className="mx-auto w-full max-w-[730px] overflow-hidden rounded-[4px] border border-black/5 bg-white shadow-sm">
          <div className="relative flex items-center bg-[rgba(235,94,26,0.667)] px-4 py-2.5 text-[14px] font-medium text-white">
            <span className="mx-auto">標題</span>
            {tab === "個人訊息" ? (
              <div className="absolute right-4 flex items-center gap-3">
                <input type="checkbox" aria-label="全選" className="h-4 w-4 accent-white" />
                <button aria-label="刪除選取訊息" className="text-white/90 hover:text-white">
                  🗑
                </button>
              </div>
            ) : null}
          </div>

          {tab === "個人訊息" ? (
            <div className="px-4 py-6 text-center text-[13px] text-black/30">無資料</div>
          ) : (
            <div>
              {ANNOUNCEMENTS.map((a) => {
                const isOpen = openIds.has(a.id);
                return (
                  <div key={a.id}>
                    <button
                      onClick={() => toggle(a.id)}
                      className={`flex w-full items-center gap-2 border-t border-black/5 px-4 py-3 text-[14px] transition-colors ${
                        isOpen ? "bg-[rgba(239,239,255,0.6)] font-medium text-[#eb5e1a]" : "text-black/80 hover:bg-black/[0.02]"
                      }`}
                    >
                      <span className="mx-auto">{a.title}</span>
                      <span
                        aria-hidden
                        className={`flex-shrink-0 text-black/30 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      >
                        ›
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="border-t border-black/5 bg-[rgba(239,239,255,0.6)] px-4 py-3 text-center text-[13px] text-black/70">
                        {a.body}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
