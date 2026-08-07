"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

// 忘記密碼 popup — confirmed live against pc.wu88.live's real homepage
// (click 忘記密碼 in the logged-out TopBar): a small 300px-wide Quasar
// dialog, NOT the same visual language as the 免費註冊 page (no big white
// card over a background photo — this is a compact centered popup over a
// dimmed backdrop). Structure/colors confirmed via getComputedStyle:
//   - header: solid #eb5e1a, white 18px text, left-aligned (not centered),
//     40px tall, 0/10px padding — same orange as the register page's
//     header, reused here too.
//   - body: 20px padding, a single outlined 手機號碼 field (Material-style
//     floating label: gray border + inline label at rest, orange
//     border+floated label when focused — confirmed both states live) with
//     "發送驗證碼" as plain gray clickable text appended inside the same
//     field box (not a separate button), then a centered white/bordered
//     "取消" button below.
// Only ONE step was directly observable: entering a phone number and
// clicking 發送驗證碼 hit the real site's own "手機號碼重複" duplicate-
// account validation (a backend response, confirmed live) before any
// further step could be seen, so no second step (code entry / new
// password) is invented here — the send action just starts a 60s cooldown
// on the text button, matching the same countdown pattern already used on
// the 免費註冊 page's SMS button.
export default function ForgotPasswordModal({ open, onClose }: Props) {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [countdown, setCountdown] = useState(0);

  if (!open) return null;

  function handleSend() {
    if (countdown > 0 || !phone) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  const floated = focused || phone.length > 0;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-[300px] overflow-hidden rounded-[5px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="flex h-[40px] items-center bg-[#eb5e1a] px-[10px] text-[18px] font-normal text-white">
          忘記密碼
        </h1>

        <div className="p-5">
          <div className="relative">
            <div
              className={`flex h-[56px] items-center rounded-[4px] border px-3 transition-colors ${
                focused ? "border-[1.5px] border-[#ff9800]" : "border-[#ccc]"
              }`}
            >
              <div className="relative flex-1">
                <label
                  className={`pointer-events-none absolute left-0 bg-white transition-all ${
                    floated
                      ? "-top-[22px] px-1 text-[12px]"
                      : "top-1/2 -translate-y-1/2 text-[16px]"
                  } ${focused ? "text-[#ff9800]" : "text-black/60"}`}
                >
                  手機號碼
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="w-full bg-transparent pt-2 text-[16px] text-black outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={countdown > 0 || !phone}
                className="flex-shrink-0 whitespace-nowrap text-[14px] text-black/[0.54] disabled:opacity-50"
              >
                {countdown > 0 ? `${countdown}秒後重發` : "發送驗證碼"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid justify-center">
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] w-[100px] rounded-[3px] border border-[#ccc] bg-white text-[14px] font-semibold text-black hover:bg-black/5"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
