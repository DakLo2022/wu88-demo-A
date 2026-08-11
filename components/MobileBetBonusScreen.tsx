"use client";

import { mobileSlotKey } from "@/lib/imageTransform";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

const BARS = [
  { need: 5888, have: 0, reward: 88 },
  { need: 68888, have: 0, reward: 188 },
];

// 投注彩金 — confirmed live at wu88.live/betting_winnings to be a dark
// (near-black) page, not the plain white card layout this used to reuse
// from desktop's BettingBonusTab. Rebuilt to match what's actually there:
//   - a festive "每日簽到禮" gift-box/coin marketing banner (own copyrighted
//     art, own upload slot) across the top.
//   - a "我的禮金" section label on a dark-gray bar, then 2 side-by-side
//     cream (#f9dfba) cards — sharp corners, no radius, confirmed live —
//     each with a title, a thin light-blue progress track, the "0/N"
//     fraction, the big reward number, and a gray (not yet claimable)
//     "領取" button.
//   - white/gray rule text on the black background below, reproduced from
//     the live page's own copy (活動內容/注意事項 verbatim short functional
//     text; the long WU88規則與條款 legal boilerplate condensed per this
//     project's copyright policy).
export default function MobileBetBonusScreen({ images }: Props) {
  const bannerSrc = pickImage(images, "mobile-bet-bonus-banner");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="投注彩金" images={images} />

      <div className="flex-1 overflow-y-auto bg-black">
        {bannerSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerSrc} alt="每日簽到禮 天天送彩金" className="block w-full" />
        ) : (
          <div className="flex aspect-[750/380] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#7a1f0a] to-[#2b0a02] px-6 text-center">
            <span aria-hidden className="text-4xl">🎁</span>
            <p className="bg-gradient-to-b from-[#ffe98a] to-[#f0b429] bg-clip-text text-[20px] font-bold text-transparent">
              每日簽到禮 天天送彩金
            </p>
          </div>
        )}

        <div className="bg-[#343434] px-3 py-2 text-[13px] font-medium text-white">
          <span className="mr-1.5 text-[#eb5e1a]">▍</span>我的禮金
        </div>

        <div className="grid grid-cols-2 gap-2 p-3">
          {BARS.map((b) => (
            <div key={b.need} className="flex flex-col items-center gap-2 bg-[#f9dfba] px-2 py-3">
              <p className="text-center text-[12px] text-black/70">每日有效投注{b.need}</p>
              <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#e1f0ff]">
                <div
                  className="h-full rounded-full bg-[#4a9eff]"
                  style={{ width: `${Math.min(100, (b.have / b.need) * 100)}%` }}
                />
              </div>
              <p className="text-[12px] text-black/60">
                {b.have}/{b.need}
              </p>
              <p className="text-[24px] font-bold text-black">{b.reward}</p>
              <button type="button" className="w-full rounded-[8px] bg-[#808080] py-1.5 text-[13px] text-black">
                領取
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 px-4 pb-8 pt-2 text-[12px] leading-relaxed text-white/60">
          <div>
            <p className="mb-1.5 text-[13px] font-medium text-white/85">每日有效投注</p>
            <ol className="list-decimal space-y-1 pl-4">
              <li>每天可申請一次簽到彩金，需當日申請，逾時不補發。</li>
              <li>當日完成每日有效投注條件，即可進行申請。</li>
              <li>活動贈送彩金只須滿足一倍流水即可提款。</li>
            </ol>
          </div>

          <div>
            <p className="mb-1.5 text-[13px] font-medium text-white/85">注意事項</p>
            <p className="mb-1.5">
              以下事項無法正常領取簽到彩金將不予補發，請會員隔日重新投注達成門檻重新領取。
            </p>
            <ol className="list-decimal space-y-1 pl-4">
              <li>
                體育賽事需等待遊戲館方結算派彩，系統才會產生有效投注；若因結算延遲導致當日未能即時符合門檻，或會員未主動領取，皆不予補發。
              </li>
              <li>
                有效投注一般於下注後 15 分鐘內更新，並非即時反映，請盡量於每日 23:45
                前達成有效投注並領取；00:00 後系統即計為隔日，先前累計歸零，不得要求補發或合併計算。
              </li>
            </ol>
          </div>

          <div>
            <p className="mb-1.5 text-[13px] font-medium text-white/85">WU88規則與條款</p>
            <ol className="list-decimal space-y-1.5 pl-4">
              <li>
                優惠使用限制：不得將此優惠點數投入德州撲克、Black jack21點，賽車/飛艇類彩票單局下注不得超過7台；體育投注賠率則不得低於歐盤1.5倍或亞盤0.5盤口。若違反上述限制，平台有權取消或收回已發放的優惠點數。
              </li>
              <li>
                不得利用真人娛樂、電子遊藝、彩票等遊戲進行無風險對沖投注，對沖或對打的投注不列入有效投注計算，賽果為和局的注單也不予採計。經風控部門查核違規者，平台將回收優惠與贈點，情節嚴重者可能被凍結帳戶。
              </li>
              <li>同一玩家、同一住址、同一信箱、同一電話號碼、相同付款方式或相同 IP，僅能領取一次優惠；重複申請者，平台保留取消優惠並扣回點數的權利。</li>
              <li>若發現以不實方式套取贈點、威脅或濫用優惠機制，平台有權凍結或關閉相關帳戶並沒收帳戶餘額。</li>
              <li>若對活動有爭議，平台有權要求會員提供充分有效的證明文件以核實資格。</li>
              <li>若會員以任何方式規避規則、確保無論輸贏都能穩賺優惠點數，平台有權終止優惠資格並追回已發放點數。</li>
              <li>WU88保留對本活動的最終解釋權，並可在不另行通知的情況下修改或終止活動。</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
