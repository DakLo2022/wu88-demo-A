"use client";

import { useState } from "react";
import Link from "next/link";

type Props = { images: Record<string, string | null> };

// 免費註冊 (加入會員) page — a standalone full-page route on the real
// pc.wu88.live site, confirmed via live DOM check: no TopBar/Navbar/Footer
// chrome at all, just a centered white card over a full-bleed background
// image. Colors/spacing/layout all measured directly via getComputedStyle
// against the live /user-login page rather than assumed from JIN's or
// LifeHigh's versions — WU88 shares JIN's white-card/squared-input
// structure (not LifeHigh's dark pill-shaped one), but has real differences
// of its own worth calling out:
//   - Header is a FLAT solid orange fill (#eb5e1a), not JIN's diagonal
//     navy→blue gradient.
//   - Has the extra 經銷商帳號 (distributor code) field at the top that
//     JIN's form doesn't have, matching LifeHigh's field count (7) instead.
//   - 確認送出/先去逛逛/發送簡訊碼 all use WU88's own accent orange
//     (#f39800, not #eb5e1a — a second, distinct orange used specifically
//     for buttons on this site) — and none of the three buttons are fully
//     rounded pills like JIN/LifeHigh's; confirmed via getComputedStyle
//     they use small border-radius (4-5px) rectangles instead.
export default function RegisterForm({ images }: Props) {
  const [distributor, setDistributor] = useState("");
  const [account, setAccount] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [smsCountdown, setSmsCountdown] = useState(0);

  const bgSrc = images["register-bg"];

  function handleSendSms() {
    if (smsCountdown > 0 || !phone) return;
    setSmsCountdown(60);
    const timer = setInterval(() => {
      setSmsCountdown((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function handleSubmit(e: React.FormEvent) {
    // Demo gallery only — there's no real backend to register against.
    e.preventDefault();
  }

  const inputClass =
    "w-full rounded-[5px] border border-[#ccc] p-[10px] text-[16px] text-black outline-none focus:border-[#f39800]";

  return (
    // "isolate" is load-bearing here (same fix documented on JIN/LifeHigh's
    // RegisterForm): without it, "relative" alone doesn't create a stacking
    // context, so the -z-10 background child would escape to the page root
    // and render behind <body>'s own background instead of behind the card.
    <div className="isolate relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Full-bleed background, fixed behind everything — confirmed live
          the real site renders this as a fixed, z-index:-1, background-size
          cover div with a rgba(0,0,0,0.4) fallback tint sitting behind the
          image (not a video, unlike some of the other sites' login pages). */}
      <div className="fixed inset-0 -z-10 bg-black/40">
        {bgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bgSrc} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="w-full max-w-[600px] overflow-hidden rounded-[10px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)]">
        <h2 className="bg-[#eb5e1a] py-1.5 text-center text-[24px] font-normal leading-[24px] text-white">
          加入會員
        </h2>

        <form onSubmit={handleSubmit} className="px-[15px] py-[10px]">
          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">經銷商帳號</label>
            <input
              value={distributor}
              onChange={(e) => setDistributor(e.target.value)}
              placeholder="經銷商帳號(沒有推薦可不填寫)"
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">會員帳號</label>
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="會員帳號(6-20位數字和字母組合)"
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">暱稱</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="暱稱(1 ~ 5位中、英、數字符)"
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">會員密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="會員密碼(需包含6-12數字和字母)"
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">確認密碼</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="確認密碼(再次輸入密碼)"
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">手機號碼</label>
            <div className="flex gap-2">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="請輸入手機號碼"
                className={`min-w-0 flex-1 ${inputClass}`}
              />
              <button
                type="button"
                onClick={handleSendSms}
                disabled={smsCountdown > 0}
                className="flex-shrink-0 whitespace-nowrap rounded-[5px] bg-[#f39800] px-3 text-[16px] font-bold text-white disabled:opacity-50"
              >
                {smsCountdown > 0 ? `${smsCountdown}秒後重發` : "發送簡訊碼"}
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">簡訊驗證碼</label>
            <input
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value)}
              placeholder="請輸入簡訊驗證碼"
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <label className="flex items-start gap-2 text-[16px] leading-relaxed text-[#333]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 flex-shrink-0"
              />
              我已年滿18歲，並已閱讀且同意接受投注規則相關規範以及服務條款
            </label>
          </div>

          <div className="mb-9 flex items-center justify-around">
            <Link
              href="/"
              className="rounded-[4px] border-2 border-[#f39800] px-4 py-2 text-[18px] text-[#f39800] hover:bg-[#f39800]/10"
            >
              先去逛逛
            </Link>
            <button
              type="submit"
              disabled={!agreed}
              className="rounded-[4px] bg-[#f39800] px-4 py-2 text-[18px] text-white disabled:opacity-50"
            >
              確認送出
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
