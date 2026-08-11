import MobileSecurityScreen from "@/components/MobileSecurityScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 安全中心 — reached from the 我的 page's 安全中心 row.
export default function SecurityPage() {
  const images = getRenderImageMap();
  return <MobileSecurityScreen images={images} />;
}
