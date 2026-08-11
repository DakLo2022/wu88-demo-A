import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import type { MobilePromotion } from "@/data/mobilePromotions";

type Props = {
  promotion: MobilePromotion;
  images: Record<string, string | null>;
};

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

function MaskIcon({ src, className }: { src: string; className: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="h-[14px] w-[3px] rounded-full bg-[#eb5e1a]" />
        <h2 className="text-[15px] font-bold text-black">{label}</h2>
      </div>
      <div className="pl-[10.5px] text-[14px] leading-relaxed text-black/70">{children}</div>
    </div>
  );
}

// 活動內容 (activity detail) page — its own standalone screen, no bottom
// tab bar at all (per explicit request, confirmed live: tapping a promo
// card on wu88.live/activity/ opens a detail view with no app-shell tab bar
// underneath it, just the header + scrollable content). Same header style
// as the list page (back arrow + centered white title on the brand
// gradient) but the title here is generic ("優惠活動"), not the specific
// promo's name — that appears as the first 活動名稱 field below the banner
// instead, matching the real detail page's field structure (活動名稱/
// 活動時間/活動對象/活動內容, each with a small orange left-accent bar next
// to a bold label) confirmed live.
export default function MobilePromotionDetail({ promotion, images }: Props) {
  const src = pickImage(images, promotion.slotId);
  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <header className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-b from-brand-from to-brand-to px-2 text-white">
        <Link href="/promotions" aria-label="返回優惠列表" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {backArrowSrc ? (
            <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </Link>
        <h1 className="flex-1 text-center text-[18px]">優惠活動</h1>
        <span className="w-8 flex-shrink-0" aria-hidden />
      </header>

      <div className="flex-1 overflow-y-auto bg-white">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={promotion.title} className="aspect-[2.6/1] w-full object-cover" />
        ) : (
          <div className="flex aspect-[2.6/1] w-full items-center justify-center bg-gradient-to-br from-brand-from/50 to-brand-dark px-4 text-center text-base font-bold text-white">
            {promotion.title}
          </div>
        )}

        <div className="px-4 py-5">
          <Field label="活動名稱">{promotion.title}</Field>
          <Field label="活動時間">{promotion.period}</Field>
          <Field label="活動對象">{promotion.audience}</Field>
          <Field label="活動內容">
            <ol className="list-decimal space-y-2 pl-4">
              {promotion.content.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ol>
          </Field>
        </div>
      </div>
    </div>
  );
}
