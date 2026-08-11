"use client";

import { useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// Deterministic pseudo-QR pattern (no real QR-encoding library — this is a
// visual stand-in for the real site's "長按儲存至相簿" QR image, which is
// itself just a plain encoded link, not creative content worth reproducing
// via an extra dependency).
function FakeQrCode({ seed }: { seed: string }) {
  const cells = 21;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const bits: boolean[] = [];
  for (let i = 0; i < cells * cells; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    bits.push((h >> 16) % 3 === 0);
  }
  return (
    <div
      className="grid aspect-square w-[150px] flex-shrink-0 border-2 border-black bg-white p-1.5"
      style={{ gridTemplateColumns: `repeat(${cells}, 1fr)` }}
    >
      {bits.map((on, i) => (
        <span key={i} className={on ? "bg-black" : "bg-white"} />
      ))}
    </div>
  );
}

// 邀請好友 (/my/invite) — confirmed live at wu88.live/invite_friend to be a
// full mobile-native page, NOT just the single full-page marketing image the
// desktop InviteFriendsTab uses. The banner art itself (mascot/coin
// artwork) is the real site's own copyrighted marketing image so it keeps
// the "upload your own" pattern; everything below it (tabs, stat cards,
// share link, QR) is real functional UI reproduced from the live page.
//
// Colors below were pulled directly via getComputedStyle on the live page
// (not eyeballed from a screenshot, after an earlier pass got this wrong):
// page background is pure black (`.invite_friend` => rgb(0,0,0)); the "我的
// 禮金" label sits on its own small dark-gray (#343434) rounded bar; the two
// stat cards are transparent/black-filled with a 1px cream (#f9dfba) border;
// the "領取" button is solid gray (#808080) with black text; the share-link
// box has a 1px warm dark-brown border (#5c534e) with a solid cream pill
// button; the QR box uses the same dark-brown border.
export default function MobileInviteScreen({ images }: Props) {
  const [copied, setCopied] = useState(false);
  const bannerSrc = pickImage(images, "mobile-invite-banner");
  const shareLink =
    typeof window !== "undefined" ? `${window.location.origin}/register?ref=agent001` : "https://wu88-demo/register?ref=agent001";

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="邀請好友" images={images} backHref="/my" />

      <div className="flex-1 overflow-y-auto bg-black">
        {bannerSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerSrc} alt="邀請好友 領雙重好禮" className="block w-full" />
        ) : (
          <div className="flex aspect-[750/460] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#2b2b2b] to-[#000] px-6 text-center">
            <span aria-hidden className="text-4xl">🐱</span>
            <p className="bg-gradient-to-b from-[#ffe98a] to-[#f0b429] bg-clip-text text-[22px] font-bold text-transparent">
              邀請好友 領雙重好禮
            </p>
          </div>
        )}

        <div className="px-4 py-4">
          <div className="flex items-center justify-between rounded-[5px] bg-[#343434] px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[14px] font-bold text-white">
              <span aria-hidden className="text-[#eb5e1a]">▍</span>我的禮金
            </span>
            <Link href="/my/invite/detail" className="text-[13px] text-[#eb5e1a]">
              查看邀請詳情
            </Link>
          </div>

          <div className="mt-3 border-t border-dashed border-white/15 pt-3">
            <p className="text-[13px] text-white/70">
              有效邀請人數：<span className="text-white">6</span> 人
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { title: "待領取首存禮金(點數)", claimed: "已領受禮金：" },
                { title: "待領取流水分成(點數)", claimed: "已領取流水：" },
              ].map((box) => (
                <div key={box.title} className="flex flex-col">
                  <div className="flex flex-col items-center gap-2 rounded-[8px] border border-[#f9dfba] p-3 text-center">
                    <p className="flex items-center gap-1 text-[11px] text-white/85">
                      {box.title}
                      <span
                        aria-hidden
                        className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full border border-[#eb5e1a] text-[9px] text-[#eb5e1a]"
                      >
                        ?
                      </span>
                    </p>
                    <p className="text-[22px] font-bold text-white">0</p>
                    <button type="button" className="w-full rounded-[8px] bg-[#808080] py-1.5 text-[12px] font-medium text-black">
                      領取
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[11px] text-white/60">
                    {box.claimed}
                    <span className="text-white/85">0</span>
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[13px] text-white/85">分享連結</p>
            <div className="mt-1.5 flex items-center gap-2 rounded-[15px] border border-[#5c534e] px-3 py-2">
              <span className="flex-1 truncate text-[12px] text-white/55">{shareLink}</span>
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(shareLink).catch(() => {});
                  }
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="flex-shrink-0 rounded-[15px] bg-[#f9dfba] px-3 py-1.5 text-[12px] font-medium text-[#959595]"
              >
                {copied ? "已複製" : "複製連結"}
              </button>
            </div>

            <p className="mt-5 text-[13px] text-white/85">分享二維碼</p>
            <div className="mt-2 flex flex-col items-center gap-2 rounded-[5px] border border-[#5c534e] p-4">
              <FakeQrCode seed={shareLink} />
              <p className="text-[12px] text-white/50">長按儲存至相簿</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
