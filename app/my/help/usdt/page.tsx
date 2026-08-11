import MobileHelpTutorialScreen from "@/components/MobileHelpTutorialScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// USDT儲值流程 — under 協助中心.
export default function HelpUsdtPage() {
  const images = getRenderImageMap();
  return <MobileHelpTutorialScreen images={images} variant="usdt" />;
}
