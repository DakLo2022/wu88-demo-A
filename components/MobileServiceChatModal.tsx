"use client";

import { useState } from "react";

type ChatMessage = {
  id: number;
  from: "agent" | "user";
  text: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, from: "agent", text: "您好，歡迎來到武財神線上客服，請問有什麼可以為您服務的嗎？" },
];

const CANNED_REPLIES = [
  "已收到您的訊息，客服人員將盡快為您處理，請耐心稍候。",
  "了解，這邊已經幫您記錄下來了，還有其他問題嗎？",
  "感謝您的耐心等候，我們會盡快與您聯繫。",
];

// Fake 在線客服 chat window — this demo has no real backend/live-agent
// system to connect to (per explicit request: "在線客服麻煩做一個假的對話
// 視窗即可"), so this is entirely local state: a canned greeting on open,
// and any message the visitor sends gets a canned reply back after a short
// delay, purely to look and feel like a working live-chat widget.
export default function MobileServiceChatModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [nextId, setNextId] = useState(2);

  function send() {
    const text = draft.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: nextId, from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    const replyId = nextId + 1;
    setNextId(replyId + 1);

    const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: replyId, from: "agent", text: reply }]);
    }, 700);
  }

  return (
    <div className="fixed inset-0 z-[95] flex flex-col bg-black/40">
      <div className="mt-auto flex h-[80%] flex-col overflow-hidden rounded-t-[12px] bg-white">
        <div className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-b from-brand-from to-brand-to px-3 text-white">
          <span className="text-[16px] font-bold">在線客服</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="ml-auto flex h-8 w-8 items-center justify-center text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-[#f5f5f5] px-3 py-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-[12px] px-3 py-2 text-[14px] leading-relaxed ${
                  m.from === "user" ? "bg-[#eb5e1a] text-white" : "bg-white text-black/80 shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 border-t border-black/10 bg-white px-3 py-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="請輸入訊息..."
            className="h-9 flex-1 rounded-[18px] bg-[#f0f0f0] px-4 text-[14px] text-black outline-none"
          />
          <button
            type="button"
            onClick={send}
            className="h-9 flex-shrink-0 rounded-[18px] bg-[#eb5e1a] px-4 text-[14px] font-semibold text-white"
          >
            送出
          </button>
        </div>
      </div>
    </div>
  );
}
