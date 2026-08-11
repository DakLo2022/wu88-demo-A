import MobileHelpTutorialScreen from "@/components/MobileHelpTutorialScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 雲支付綁定流程 — under 協助中心.
export default function HelpTaiwanPayPage() {
  const images = getRenderImageMap();
  return <MobileHelpTutorialScreen images={images} variant="taiwan-pay" />;
}
