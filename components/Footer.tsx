"use client";

import { useState } from "react";
import { footerGroups, footerMeta } from "@/data/footerLinks";
import { VENDOR_LOGO_SLOT_IDS } from "@/lib/imageSlots";

type Props = {
  images: Record<string, string | null>;
};

// Site-wide footer with sitemap columns + app-download placeholders.
// Gray section with white text, centered columns separated by a thin
// horizontal rule under each category heading (no vertical dividers), and
// stacked app-download badges. Bottom strip shows vendor/partner logos
// (from the "logo" image-manager category) instead of a text line — only
// slots that actually have an uploaded file are rendered. The sitemap
// block can be collapsed via the arrow next to 網站導覽.
export default function Footer({ images }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const uploadedVendorLogos = VENDOR_LOGO_SLOT_IDS.map((id) => images[id]).filter(
    (src): src is string => Boolean(src)
  );

  return (
    <footer className="border-t border-white/10 bg-brand-panel text-white/70">
      <div className="mx-auto max-w-[1320px] px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="cursor-pointer hover:text-white">{footerMeta.aboutLabel}</span>
          <span>|</span>
          <span className="cursor-pointer hover:text-white">{footerMeta.faqLabel}</span>
          <span>|</span>
          <span>{footerMeta.version}</span>
          <span className="ml-auto flex items-center gap-1.5 cursor-pointer hover:text-white">
            {footerMeta.siteMapLabel}
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "展開廠商內容" : "收合廠商內容"}
              className={`inline-flex h-4 w-4 items-center justify-center transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            >
              ▲
            </button>
          </span>
        </div>
      </div>

      {/* Sitemap block: gray background, white text per reference layout. */}
      {!collapsed && (
      <div className="bg-neutral-500 text-white">
        <div className="mx-auto max-w-[1320px] px-4 py-6">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {footerGroups.map((group) => (
              <div key={group.title} className="text-center">
                <p className="mb-2 flex items-center justify-center gap-1 text-sm font-semibold text-white">
                  <span className="text-[10px] text-white/70">●</span>
                  {group.title}
                </p>
                <div className="mx-auto mb-2 h-px w-8 bg-white/30" />
                <ul className="space-y-1">
                  {group.links.map((link) => (
                    <li key={link} className="cursor-pointer text-[11px] text-white/80 hover:text-brand-accent">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="text-center">
              <div className="flex flex-col items-center gap-2.5">
                {["footer-qr-1", "footer-qr-2"].map((slotId, idx) =>
                  images[slotId] ? (
                    <div
                      key={slotId}
                      className="flex h-14 w-40 items-center justify-center rounded-lg bg-white px-4 py-2.5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images[slotId]!}
                        alt={idx === 0 ? "iOS 下載" : "Android 下載"}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      key={slotId}
                      className="flex h-14 w-40 items-center justify-center rounded-lg bg-white px-4 py-2.5 text-[11px] font-medium text-neutral-800"
                      aria-label="App 下載按鈕佔位"
                    >
                      {idx === 0 ? "iOS 下載" : "Android 下載"}
                    </div>
                  )
                )}
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{footerMeta.appTitle}</p>
              <p className="text-[11px] text-white/70">{footerMeta.appSubtitle}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Vendor/partner logo strip — only shows once logos are uploaded via
          /image-manager's "廠商 Logo" category. */}
      {uploadedVendorLogos.length > 0 && (
        <div className="border-t border-white/10 bg-black">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-4">
            {uploadedVendorLogos.map((src, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={idx} src={src} alt="合作廠商 Logo" className="h-8 w-auto object-contain opacity-80" />
            ))}
          </div>
        </div>
      )}
    </footer>
  );
}
