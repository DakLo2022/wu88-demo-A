import MobileHelpTutorialScreen from "@/components/MobileHelpTutorialScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 支付寶綁定流程 — under 協助中心.
export default function HelpAlipayPage() {
  const images = getRenderImageMap();
  return <MobileHelpTutorialScreen images={images} variant="alipay" />;
}
