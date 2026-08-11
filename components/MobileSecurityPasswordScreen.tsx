"use client";

import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null>; title: string; submitLabel?: string };

const fieldClass =
  "w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none";

// Shared 原始密碼/新密碼/確認新密碼 form — used for both 修改登入密碼 and
// 修改託售密碼, which share the exact same 3-field layout on the real site
// (only the page title differs). Matches desktop MemberCentreModal's
// SecurityTab "登入"/"託售" sub-tab field set.
export default function MobileSecurityPasswordScreen({ images, title, submitLabel = "修改" }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title={title} images={images} backHref="/my/security" />
      <div className="flex-1 overflow-y-auto bg-[#f0eff5] px-4 py-6">
        <div className="flex flex-col gap-3 rounded-[10px] bg-white p-5">
          <input type="password" placeholder="原始密碼" className={fieldClass} />
          <input type="password" placeholder="新密碼" className={fieldClass} />
          <input type="password" placeholder="確認新密碼" className={fieldClass} />
          <button type="button" className="mt-2 w-full rounded-[4px] bg-[#ff9800] py-3 text-[14px] font-medium text-white">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
