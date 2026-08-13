import MobileTransferScreen from "@/components/MobileTransferScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 額度轉換 (/transfer) — reached via the home page's 存提 popup, 轉點 button.
export default function TransferPage() {
  const images = getRenderImageMap();
  return <MobileTransferScreen images={images} />;
}
