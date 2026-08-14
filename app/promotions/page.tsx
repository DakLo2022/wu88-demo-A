import { Suspense } from "react";
import MobilePromotionsScreen from "@/components/MobilePromotionsScreen";
import DesktopPromotionsScreen from "@/components/DesktopPromotionsScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 優惠活動 (/promotions) — reached from the bottom tab bar's 優惠 button on
// mobile, and from the Navbar's "優惠活動" link on desktop. Renders two
// completely separate trees toggled by CSS breakpoint (same convention as
// app/page.tsx), since the desktop version, confirmed live on
// pc.wu88.live/activity, is a totally different standalone layout (sticky
// orange tab bar + banner/field content) rather than the mobile card-list
// page scaled up.
//
// DesktopPromotionsScreen reads useSearchParams() (to open the activity
// requested via `?id=`), which Next.js requires to be wrapped in Suspense
// so the rest of the page can still be statically rendered — same pattern
// already used for MobileHeader on the homepage.
export default function PromotionsPage() {
  const images = getRenderImageMap();
  return (
    <>
      <div className="hidden md:block">
        <Suspense fallback={null}>
          <DesktopPromotionsScreen images={images} />
        </Suspense>
      </div>
      <div className="md:hidden">
        <MobilePromotionsScreen images={images} />
      </div>
    </>
  );
}
