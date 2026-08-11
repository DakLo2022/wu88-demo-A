"use client";

import Link from "next/link";
import MobileSubPageHeader from "./MobileSubPageHeader";
import { SECURITY_ROWS } from "@/data/mobileMy";

type Props = { images: Record<string, string | null> };

// 安全中心 — list page linking to the 3 password-management sub-pages.
// Matches desktop MemberCentreModal's SecurityTab sub-tab set exactly (same
// 3 items, colors, order — confirmed against pc.wu88.live) but rebuilt as a
// list of navigable rows instead of in-page sub-tabs, matching how every
// other mobile 我的-menu section navigates.
export default function MobileSecurityScreen({ images }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="安全中心" images={images} />
      <div className="flex-1 overflow-y-auto bg-[#f0eff5] px-[15px] pt-[15px]">
        <div className="overflow-hidden rounded-[10px] bg-white">
          {SECURITY_ROWS.map((row, idx) => (
            <Link
              key={row.key}
              href={row.href}
              className={`flex h-[52px] w-full items-center gap-3 px-4 text-[14px] text-black/[0.87] ${
                idx > 0 ? "border-t border-black/[0.06]" : ""
              }`}
            >
              <span
                aria-hidden
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[14px]"
                style={{ backgroundColor: `${row.color}1a`, color: row.color }}
              >
                {row.icon}
              </span>
              <span className="flex-1 text-left">{row.label}</span>
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-black/25" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
