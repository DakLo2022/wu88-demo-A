"use client";

import { useState } from "react";

type Props = {
  images: Record<string, string | null>;
};

// Top utility bar: language/timezone selectors + login/register controls.
// All auth is fake/local state — no backend calls.
export default function TopBar({ images }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const registerIconSrc = images["topbar-register-icon"];
  const eyeShowIconSrc = images["topbar-eye-show"];
  const eyeHideIconSrc = images["topbar-eye-hide"];
  const eyeIconSrc = showPassword ? eyeHideIconSrc : eyeShowIconSrc;

  return (
    <div className="flex h-10 items-center bg-gradient-to-b from-brand-from to-brand-to text-[11px] text-white">
      {/* Same max-width + horizontal padding as Navbar's inner container so
          the left/right edges of both bars line up exactly. */}
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-3">
          <select className="rounded bg-white/10 px-2 py-0.5 text-white outline-none">
            <option>繁體中文</option>
            <option>English</option>
          </select>
          <select className="rounded bg-white/10 px-2 py-0.5 text-white outline-none">
            <option>GMT +08:00</option>
            <option>GMT +00:00</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button className="flex items-center gap-1 rounded-[6px] bg-brand-accent px-3 py-1.5 font-medium text-[var(--brand-button-text)] hover:bg-brand-accentDark">
            {registerIconSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={registerIconSrc} alt="" className="h-4 w-4 object-contain" />
            ) : (
              <span>👤</span>
            )}
            免費註冊
          </button>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="帳號"
            className="w-24 rounded-[6px] border border-white/40 bg-white/25 px-3 py-1.5 text-white placeholder-white/80 outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密碼"
              className="w-24 rounded-[6px] border border-white/40 bg-white/25 px-3 py-1.5 pr-7 text-white placeholder-white/80 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
              aria-label="顯示密碼"
            >
              {eyeIconSrc ? (
                // SVG icon recolored via CSS mask (so it can be tinted white
                // regardless of the fill color baked into the uploaded file).
                <span
                  aria-hidden
                  className="block h-4 w-4 bg-white"
                  style={{
                    WebkitMaskImage: `url(${eyeIconSrc})`,
                    maskImage: `url(${eyeIconSrc})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                />
              ) : showPassword ? (
                "🙈"
              ) : (
                "👁"
              )}
            </button>
          </div>
          <button className="rounded-[6px] bg-brand-accent px-4 py-1.5 font-semibold text-[var(--brand-button-text)] hover:bg-brand-accentDark">
            登入
          </button>
          <button className="rounded-[6px] bg-brand-accent px-4 py-1.5 font-medium text-[var(--brand-button-text)] hover:bg-brand-accentDark">
            忘記密碼
          </button>
        </div>
      </div>
    </div>
  );
}
