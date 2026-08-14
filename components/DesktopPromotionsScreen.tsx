"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";
import { getMobilePromotionById } from "@/data/mobilePromotions";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// Only 4 of the mobile list's 5 promotions per explicit request ("只需要
// 四個活動"). Confirmed live on pc.wu88.live/activity, 2026-08-14: of the
// mobile list's 5 entries, exactly 4 have a matching real desktop tab
// (母 id "2", 父愛加倍 苦氣回饋, has no desktop tab at all — the real
// desktop page's 17 tabs never mention it), so those 4 are the ones this
// page surfaces, in the same relative order they appear in the real tab
// bar (生生不息 → 商城好禮購 → 全民皆代理 → 贏了你帶走), with 生生不息
// active by default just like the real site's own default tab.
// Exported so HeroCarousel (the homepage's desktop banner) can link each of
// its slides to a matching activity's detail tab via `/promotions?id=`.
export const DESKTOP_PROMOTION_IDS = ["3", "1", "5", "4"] as const;

// 活動名稱/活動時間 confirmed live per-tab on pc.wu88.live/activity — these
// differ from the mobile list's own title/period (e.g. mobile id "3"'s
// title is the longer marketing headline "彩點川流不止 利息生生不息" used
// for its list-card, while the real desktop 活動名稱 field for that same
// activity just reads "生生不息"; periods are live/rolling dates like
// "即日起" or "2026-07-25起" rather than the mobile copy's generic "長期
// activity/指定賽事期間"). 活動對象/活動內容 matched the existing mobile
// data closely enough (both are paraphrases of the same real rules,
// confirmed live against this same pass) to reuse as-is rather than
// duplicating a second, slightly-different paraphrase.
const DESKTOP_FIELDS: Record<string, { title: string; period: string }> = {
  "3": { title: "生生不息", period: "2026-07-25起" },
  "1": { title: "商城好禮購", period: "長期活動" },
  "5": { title: "全民皆代理，分享就分成", period: "即日起" },
  "4": { title: "贏了你帶走，負彩我包賠", period: "即日起" },
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-[16px] w-[3px] flex-shrink-0 rounded-full bg-[#eb5e1a]" />
        <h2 className="text-[16px] font-bold text-black">{label}</h2>
      </div>
      <div className="text-[15px] leading-relaxed text-black/70">{children}</div>
    </div>
  );
}

// 優惠活動 (/promotions, desktop) — confirmed live on pc.wu88.live/activity,
// 2026-08-14. Standalone page, NOT wrapped in the site's usual
// TopBar/Navbar/SideDock/Footer chrome (confirmed via `document.body
// .children.length`, which is just the sticky tab header + content —
// nothing else). Per this project's convention every visual detail below
// was re-verified live rather than assumed from a sister project (jin-demo
// has an analogous desktop /activity page, but its header is a two-tone
// gradient and its body is a single tall image — both confirmed NOT to be
// the case here):
//   - header (`.tab-buttons`): sticky, top:0, z-index:1001, 66px tall,
//     SOLID `#eb5e1a` background (not a gradient), padding 20px 10px 0px.
//     Title "優惠活動" is a plain h3, 36px/400 weight, white, 40px right
//     margin before the tab row.
//   - tabs (`.wrapper` button): one per activity, its 活動名稱 (short
//     desktop title, not the mobile list's longer marketing headline).
//     Auto width, 10px padding, 10px right margin, nowrap, radius
//     "5px 5px 0 0". ACTIVE tab: solid white bg, `#eb5e1a` text (matches
//     the header's own orange — NOT jin's dark #2a4556). Inactive:
//     transparent bg, white text. (Real site has 17 tabs in an
//     `overflow:hidden` row; this demo only ever renders 4, so the overflow
//     situation the real site has never arises here.)
//   - body: white background, confirmed live to be a structured content
//     block — NOT a single image like jin-demo's desktop activity page —
//     with a full-width banner image followed by the same 活動名稱/活動
//     時間/活動對象/活動內容 field structure already used on the mobile
//     detail page (small `#eb5e1a` accent bar + bold label), just laid out
//     in a wider ~1338px-max container with no extra left indent on the
//     field content (mobile indents content under the accent bar; desktop
//     doesn't).
//   - banner image: confirmed live the real banner's aspect ratio
//     (~1338×517 measured) is effectively the same 2.6:1 ratio already used
//     for the mobile list/detail banner image (780×300), and every
//     activity's desktop banner is recognizably the same artwork/
//     composition as its mobile banner just shown wider — so this reuses
//     `promotion.slotId` (the existing mobile-promo banner upload) instead
//     of adding a second, likely-duplicate upload slot per activity.
//   - switching tabs is a client-side swap (confirmed live: URL updates to
//     `?id=N&originid=M` without a full reload) — reproduced here via local
//     useState, deep-linkable via this demo's own `?id=<promoId>` query
//     param (own convention, not the real site's numeric ids).
export default function DesktopPromotionsScreen({ images }: Props) {
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState<string>(DESKTOP_PROMOTION_IDS[0]);

  useEffect(() => {
    const requested = searchParams.get("id");
    if (requested && (DESKTOP_PROMOTION_IDS as readonly string[]).includes(requested)) {
      setActiveId(requested);
    }
  }, [searchParams]);

  const promo = getMobilePromotionById(activeId);
  const fields = DESKTOP_FIELDS[activeId];
  const bannerSrc = promo ? pickImage(images, promo.slotId) : null;

  return (
    <div className="min-h-screen bg-white">
      <div
        className="sticky top-0 z-[1001] flex items-start gap-10 px-[10px] pt-5"
        style={{ backgroundColor: "#eb5e1a" }}
      >
        <h3 className="mr-10 flex-shrink-0 pb-[10px] text-[36px] font-normal text-white">優惠活動</h3>

        <div className="flex items-center gap-[10px] overflow-hidden">
          {DESKTOP_PROMOTION_IDS.map((id) => {
            const active = id === activeId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveId(id)}
                className={`flex-shrink-0 whitespace-nowrap rounded-t-[5px] px-[10px] py-[10px] text-[16px] ${
                  active ? "bg-white text-[#eb5e1a]" : "bg-transparent text-white"
                }`}
              >
                {DESKTOP_FIELDS[id].title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[1338px] px-[10px] py-8">
        {bannerSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerSrc} alt={fields?.title ?? ""} className="aspect-[2.6/1] w-full rounded object-cover" />
        ) : (
          <div className="flex aspect-[2.6/1] w-full items-center justify-center rounded bg-gradient-to-br from-brand-from/50 to-brand-dark px-4 text-center text-lg font-bold text-white">
            {fields?.title}
          </div>
        )}

        {promo && fields ? (
          <div className="pt-8">
            <Field label="活動名稱">{fields.title}</Field>
            <Field label="活動時間">{fields.period}</Field>
            <Field label="活動對象">{promo.audience}</Field>
            <Field label="活動內容">
              <ol className="list-decimal space-y-2 pl-5">
                {promo.content.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ol>
            </Field>
          </div>
        ) : null}
      </div>
    </div>
  );
}
