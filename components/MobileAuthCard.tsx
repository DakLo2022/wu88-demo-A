"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";

type Props = { images: Record<string, string | null> };

// Prefers whichever was actually uploaded — the mobile-specific image
// (stored under the "__mobile" key when uploaded via the "手機" tab in
// /image-manager) or the plain/desktop one. Every image on this mobile-only
// screen must go through this, same as MobileCategoryExplorer's pickImage:
// a background uploaded via the "手機" tab (the natural choice for a
// mobile-only page like this one) was silently invisible without it, since
// getRenderImageMap() populates BOTH keys but a component that only reads
// the plain key never sees the "__mobile" one.
function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

type View = "login" | "register" | "forgot";

// Mobile-only 會員登入/會員註冊/忘記密碼 screen — this is its own dedicated
// route (/login), never RWD-shared with the desktop TopBar-inline login or
// the desktop-only /register page. Confirmed live against wu88.live's real
// mobile /user-login (a completely different m-dot site from pc.wu88.live,
// same "not RWD, just replicate what you see" situation as everywhere else
// in this project): all THREE screens are actually ONE component/URL on the
// real site too — clicking 註冊/忘記密碼/the bottom banner link just swaps
// which "newLogin_section" is shown, no page navigation — so this mirrors
// that exact architecture with a single `view` state instead of 3 routes.
//
// Every color/size/radius below was measured via getComputedStyle /
// getBoundingClientRect against the live site rather than assumed:
//   - card: 344px wide, bg rgba(0,0,0,0.4), 16px radius, 1px solid
//     rgba(193,193,193,.7) border, inset 0 0 4px rgba(193,193,193,1) shadow.
//   - pill inputs: 48px tall, bg rgba(0,0,0,.7), 1px solid
//     rgba(100,100,100,.7), fully rounded.
//   - 註冊/登入/確認送出 buttons: ALL the same style (gold #fabe2c bg, dark
//     brown #581d07 text, fully rounded, 29px tall) — despite looking
//     slightly different shades in screenshots, getComputedStyle confirmed
//     the background-color is byte-for-byte identical; that was a JPEG
//     compression illusion, not a real difference.
//   - 先去逛逛/忘記密碼/記住帳號密碼 links: #cbc4b2, 12px, underlined, 600
//     weight — always this beige color, never the brand accent.
//   - bottom banner ("沒有帳號？點這裡立即註冊" / "已有帳戶，點這裡立即登入"):
//     its own detached box below the card, bg rgba(0,0,0,.76), only the
//     BOTTOM two corners rounded (16px), white 15px link text, no underline.
//   - 忘記密碼 screen only ever showed the phone-entry step live (a hidden
//     "驗證" button confirmed via computed style — display:none — exists in
//     the real DOM for a later step, but clicking 發送驗證碼 with a fake
//     number never revealed it, no real backend to validate against), so
//     only that one step is built here, same scope limit already applied to
//     every other 忘記密碼 screen in this project.
export default function MobileAuthCard({ images }: Props) {
  const router = useRouter();
  const [view, setView] = useState<View>("login");

  const bgSrc = pickImage(images, "mobile-login-bg");
  const logoSrc = pickImage(images, "logo");
  const eyeShowSrc = images["topbar-eye-show"];
  const eyeHideSrc = images["topbar-eye-hide"];
  const csIconSrc = pickImage(images, "mobile-login-cs-icon");

  // Login state
  const [loginAccount, setLoginAccount] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register state
  const [distributor, setDistributor] = useState("");
  const [regAccount, setRegAccount] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordVisible, setRegPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [nickname, setNickname] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [regSmsCountdown, setRegSmsCountdown] = useState(0);

  // Forgot-password state
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotSmsCountdown, setForgotSmsCountdown] = useState(0);

  function startCountdown(setter: (fn: (s: number) => number) => void) {
    setter(() => 60);
    const timer = setInterval(() => {
      setter((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function handleRegSendSms() {
    if (regSmsCountdown > 0 || !regPhone) return;
    startCountdown((fn) => setRegSmsCountdown(fn));
  }

  function handleForgotSendSms() {
    if (forgotSmsCountdown > 0 || !forgotPhone) return;
    startCountdown((fn) => setForgotSmsCountdown(fn));
  }

  function handleSubmit(e: React.FormEvent) {
    // Demo gallery only — there's no real backend to authenticate against.
    // 登入/註冊 fake-authenticate and send the visitor back to the home page
    // with `?loggedIn=1` so MobileHeader actually shows the logged-in navbar
    // state it reads that flag for — 忘記密碼 doesn't log anyone in, so it's
    // excluded here.
    e.preventDefault();
    if (view === "login" || view === "register") {
      router.push("/?loggedIn=1");
    }
  }

  const inputClass =
    "h-[48px] w-full rounded-full border border-[rgba(100,100,100,0.7)] bg-black/70 px-4 text-[14px] text-white placeholder-white/50 outline-none";

  function EyeToggle({
    visible,
    onToggle,
  }: {
    visible: boolean;
    onToggle: () => void;
  }) {
    const iconSrc = visible ? eyeHideSrc : eyeShowSrc;
    return (
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
        aria-label="顯示密碼"
      >
        {iconSrc ? (
          <span
            aria-hidden
            className="block h-4 w-4 bg-white/70"
            style={{
              WebkitMaskImage: `url(${iconSrc})`,
              maskImage: `url(${iconSrc})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        ) : visible ? (
          "🙈"
        ) : (
          "👁"
        )}
      </button>
    );
  }

  function CircleCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
          checked ? "border-brand-accent bg-brand-accent" : "border-[#cbc4b2] bg-transparent"
        }`}
      >
        {checked ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
      </button>
    );
  }

  // Bottom detached banner — same box on all three screens, only the text +
  // target view differ (登入 ↔ 註冊 both point at each other; 忘記密碼 points
  // back at 登入, matching the real site's "已有帳戶，點這裡立即登入" reuse).
  const underView =
    view === "login"
      ? { text: "沒有帳號？點這裡立即註冊", target: "register" as View }
      : { text: "已有帳戶，點這裡立即登入", target: "login" as View };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-from via-black to-black">
      {bgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}

      {/* 客服中心 pill, pinned top-right — decorative only in this demo (no
          live chat widget to wire up), matches the real site's position/
          style exactly (bg black/75, 34px radius, white 13px text). Icon is
          CSS-mask recolored to solid white (same trick as the password
          eye-toggle icon below) rather than rendered in its uploaded file's
          own colors, since this project only has one shared upload slot per
          icon and the real site's icon here is genuinely white. */}
      <div className="absolute right-5 top-[25px] z-10 flex items-center gap-1.5 rounded-[34px] bg-black/75 px-4 py-2 text-white">
        {csIconSrc ? (
          <span
            aria-hidden
            className="block h-4 w-4 bg-white"
            style={{
              WebkitMaskImage: `url(${csIconSrc})`,
              maskImage: `url(${csIconSrc})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        ) : (
          <span className="text-sm leading-none" aria-hidden>
            🎧
          </span>
        )}
        <span className="text-[13px]">客服中心</span>
      </div>

      <div className="relative mx-auto w-full max-w-[414px] px-[35px] pt-[128px]">
        <div className="mb-4 flex h-[46px] items-center justify-center">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt="Logo" className="h-full w-auto max-w-[224px] object-contain" />
          ) : (
            <span className="text-2xl font-extrabold text-white">WU88</span>
          )}
        </div>

        <div className="rounded-[16px] border border-[rgba(193,193,193,0.7)] bg-black/40 px-[30px] py-4 shadow-[inset_0_0_4px_rgba(193,193,193,1)]">
          {view === "login" ? (
            <form onSubmit={handleSubmit}>
              <h1 className="mb-[10px] text-center text-[16px] font-bold text-white">會員登入</h1>

              <div className="mb-3">
                <input
                  value={loginAccount}
                  onChange={(e) => setLoginAccount(e.target.value)}
                  placeholder="會員帳號(6-20位數字和字母組合)"
                  className={inputClass}
                />
              </div>

              <div className="relative mb-2">
                <input
                  type={loginPasswordVisible ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="密碼(需包含6-12數字和字母)"
                  className={inputClass}
                />
                <EyeToggle visible={loginPasswordVisible} onToggle={() => setLoginPasswordVisible((v) => !v)} />
              </div>

              <label className="mb-3 flex items-center gap-1.5">
                <CircleCheckbox checked={rememberMe} onChange={setRememberMe} />
                <span className="text-[12px] font-semibold text-[#cbc4b2] underline">記住帳號密碼</span>
              </label>

              <div className="mb-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="h-[29px] w-[92px] rounded-full bg-[#fabe2c] text-[14px] text-[#581d07]"
                >
                  註冊
                </button>
                <button
                  type="submit"
                  className="h-[29px] w-[92px] rounded-full bg-[#fabe2c] text-[14px] text-[#581d07]"
                >
                  登入
                </button>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/" className="text-[12px] font-semibold text-[#cbc4b2] underline">
                  先去逛逛
                </Link>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-[12px] font-semibold text-[#cbc4b2] underline"
                >
                  忘記密碼
                </button>
              </div>
            </form>
          ) : null}

          {view === "register" ? (
            <form onSubmit={handleSubmit}>
              <h1 className="mb-[10px] text-center text-[16px] font-bold text-white">會員註冊</h1>

              <div className="mb-3">
                <input
                  value={distributor}
                  onChange={(e) => setDistributor(e.target.value)}
                  placeholder="經銷商帳號(沒有推薦可不填寫)"
                  className={inputClass}
                />
              </div>

              <div className="mb-3">
                <input
                  value={regAccount}
                  onChange={(e) => setRegAccount(e.target.value)}
                  placeholder="會員帳號(6-20位數字和字母組合)"
                  className={inputClass}
                />
              </div>

              <div className="relative mb-3">
                <input
                  type={regPasswordVisible ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="密碼(需包含6-12數字和字母)"
                  className={inputClass}
                />
                <EyeToggle visible={regPasswordVisible} onToggle={() => setRegPasswordVisible((v) => !v)} />
              </div>

              <div className="relative mb-3">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="確認密碼(再次輸入密碼)"
                  className={inputClass}
                />
                <EyeToggle
                  visible={confirmPasswordVisible}
                  onToggle={() => setConfirmPasswordVisible((v) => !v)}
                />
              </div>

              <div className="mb-3">
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="暱稱(1 ~ 5位中、英、數字符)"
                  className={inputClass}
                />
              </div>

              <div className="relative mb-3">
                <input
                  type="number"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="手機號碼"
                  className={`${inputClass} pr-24`}
                />
                <button
                  type="button"
                  onClick={handleRegSendSms}
                  disabled={regSmsCountdown > 0 || !regPhone}
                  className="absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded text-[12px] text-[#f88247] disabled:opacity-50"
                >
                  {regSmsCountdown > 0 ? `${regSmsCountdown}秒後重發` : "發送驗證碼"}
                </button>
              </div>

              <label className="mb-3 flex items-start gap-1.5">
                <span className="mt-0.5">
                  <CircleCheckbox checked={agreed} onChange={setAgreed} />
                </span>
                <span className="text-[14px] leading-snug text-white">
                  我已年滿18歲，並已閱讀且同意接受投注規則相關規範以及{" "}
                  <Link href="/" className="text-[#2782d7] underline">
                    服務條款
                  </Link>
                </span>
              </label>

              <div className="mb-3 flex justify-center">
                <button
                  type="submit"
                  disabled={!agreed}
                  className="h-[29px] w-[120px] rounded-full bg-[#fabe2c] text-[14px] text-[#581d07] disabled:opacity-50"
                >
                  確認送出
                </button>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/" className="text-[12px] font-semibold text-[#cbc4b2] underline">
                  先去逛逛
                </Link>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-[12px] font-semibold text-[#cbc4b2] underline"
                >
                  忘記密碼
                </button>
              </div>
            </form>
          ) : null}

          {view === "forgot" ? (
            <form onSubmit={handleSubmit}>
              <h1 className="mb-[10px] text-center text-[16px] font-bold text-white">忘記密碼</h1>

              <div className="relative mb-3">
                <input
                  type="number"
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  placeholder="手機號碼"
                  className={`${inputClass} pr-24`}
                />
                <button
                  type="button"
                  onClick={handleForgotSendSms}
                  disabled={forgotSmsCountdown > 0 || !forgotPhone}
                  className="absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded text-[12px] text-[#f88247] disabled:opacity-50"
                >
                  {forgotSmsCountdown > 0 ? `${forgotSmsCountdown}秒後重發` : "發送驗證碼"}
                </button>
              </div>

              <div>
                <Link href="/" className="text-[12px] font-semibold text-[#cbc4b2] underline">
                  先去逛逛
                </Link>
              </div>
            </form>
          ) : null}
        </div>

        {/* Flush against the card's bottom edge with zero gap — confirmed
            live: `.newLogin_underView`'s top is byte-for-byte equal to
            `.newLogin_view`'s (the card's) bottom, they share one edge, not
            a separate floating box below it. Width is 260px against the
            card's 344px (75.6%), centered — also measured live, not a full-
            width bar. */}
        <div className="mx-auto w-[260px] rounded-b-[16px] bg-black/[0.76] px-[10px] py-[10px]">
          <button
            type="button"
            onClick={() => setView(underView.target)}
            className="block w-full text-center text-[15px] text-white"
          >
            {underView.text}
          </button>
        </div>
      </div>
    </div>
  );
}
