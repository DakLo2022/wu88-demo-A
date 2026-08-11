import MobileVipLevelScreen from "@/components/MobileVipLevelScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 會員等級 — under 會員資料.
export default function VipLevelPage() {
  const images = getRenderImageMap();
  return <MobileVipLevelScreen images={images} />;
}
