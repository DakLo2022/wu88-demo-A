import MobileDepositScreen from "@/components/MobileDepositScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 儲值 (/deposit) — reached via the home page's 存提 popup, 儲值 button.
export default function DepositPage() {
  const images = getRenderImageMap();
  return <MobileDepositScreen images={images} />;
}
