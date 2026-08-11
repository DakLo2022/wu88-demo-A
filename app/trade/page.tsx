import MobileTradeScreen from "@/components/MobileTradeScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// Mobile-only 帳務 (account/billing) page — reached from the bottom tab
// bar's 帳務 button. Standalone route with its own header, no
// MobileHeader/hero/category-explorer.
export default function TradePage() {
  const images = getRenderImageMap();
  return <MobileTradeScreen images={images} />;
}
