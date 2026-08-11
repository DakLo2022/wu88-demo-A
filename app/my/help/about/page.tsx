import MobileHelpAboutScreen from "@/components/MobileHelpAboutScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 關於我們 — under 協助中心.
export default function HelpAboutPage() {
  const images = getRenderImageMap();
  return <MobileHelpAboutScreen images={images} />;
}
