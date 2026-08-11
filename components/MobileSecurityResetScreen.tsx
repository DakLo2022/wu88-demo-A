"use client";

import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

const fieldClass =
  "w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none";

// 重設託售密碼 — confirmed live to use a different field set from the other
// two security forms: phone number + SMS verification code instead of an
// original-password check. Matches desktop MemberCentreModal's SecurityTab
// "重設" sub-tab.
export default function MobileSecurityResetScreen({ images }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="重設託售密碼" images={images} backHref="/my/security" />
      <div className="flex-1 overflow-y-auto bg-[#f0eff5] px-4 py-6">
        <div className="flex flex-col gap-3 rounded-[10px] bg-white p-5">
          <div className="flex items-center gap-2 rounded-[4px] border border-black/15 px-3 py-2">
            <div className="flex-1">
              <div className="text-[11px] text-black/50">手機號碼</div>
              <div className="text-[14px] text-black/80">u79</div>
            </div>
            <button type="button" className="flex-shrink-0 rounded-[3px] bg-[#2196f3] px-3 py-1.5 text-[12px] font-medium text-white">
              取得驗證碼
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-[4px] border border-black/15 px-3 py-2">
            <input placeholder="驗證碼" className="flex-1 py-1 text-[14px] text-black/85 outline-none placeholder-black/40" />
            <button type="button" className="flex-shrink-0 rounded-[3px] bg-[#9c27b0] px-3 py-1.5 text-[12px] font-medium text-white">
              驗證
            </button>
          </div>
          <input type="password" placeholder="新密碼" className={fieldClass} />
          <input type="password" placeholder="確認新密碼" className={fieldClass} />
          <button type="button" className="mt-2 w-full rounded-[4px] bg-[#009688] py-3 text-[14px] font-medium text-white">
            修改
          </button>
        </div>
      </div>
    </div>
  );
}
