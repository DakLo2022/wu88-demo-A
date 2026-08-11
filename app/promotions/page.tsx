import MobilePromotionsScreen from "@/components/MobilePromotionsScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// Mobile-only 優惠 (promotions) list — reached from the bottom tab bar's
// 優惠 button. Standalone route, no MobileHeader/hero/category-explorer.
export default function PromotionsPage() {
  const images = getRenderImageMap();
  return <MobilePromotionsScreen images={images} />;
}
