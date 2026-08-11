import MobileServiceClientScreen from "@/components/MobileServiceClientScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 客服中心 (customer service center) — reached from the 服務 page's 武財神
// 真人客服 card.
export default function ServiceClientPage() {
  const images = getRenderImageMap();
  return <MobileServiceClientScreen images={images} />;
}
