import MobileWithdrawalScreen from "@/components/MobileWithdrawalScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 託售 (/withdrawal) — reached via the home page's 存提 popup, 託售 button.
export default function WithdrawalPage() {
  const images = getRenderImageMap();
  return <MobileWithdrawalScreen images={images} />;
}
