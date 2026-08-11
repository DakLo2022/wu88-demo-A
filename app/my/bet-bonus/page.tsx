import MobileBetBonusScreen from "@/components/MobileBetBonusScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 投注彩金 — reached from the 我的 page's 投注彩金 row.
export default function BetBonusPage() {
  const images = getRenderImageMap();
  return <MobileBetBonusScreen images={images} />;
}
