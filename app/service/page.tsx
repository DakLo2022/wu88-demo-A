import MobileServiceScreen from "@/components/MobileServiceScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// Mobile-only 服務 (service) page — reached from the bottom tab bar's 服務
// button. Standalone route with its own header, no MobileHeader/hero/
// category-explorer.
export default function ServicePage() {
  const images = getRenderImageMap();
  return <MobileServiceScreen images={images} />;
}
