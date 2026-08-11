import MobileMyScreen from "@/components/MobileMyScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// Mobile-only 我的 (profile) page — reached from the bottom tab bar's 我
// button.
export default function MyPage() {
  const images = getRenderImageMap();
  return <MobileMyScreen images={images} />;
}
