import MobileBetHistoryScreen from "@/components/MobileBetHistoryScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 投注記錄 — the 6th 帳戶明細 sub-item, confirmed live as its own separate
// page rather than a tab on the shared 帳戶明細 page.
export default function BetHistoryPage() {
  const images = getRenderImageMap();
  return <MobileBetHistoryScreen images={images} />;
}
