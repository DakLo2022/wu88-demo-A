import MobileHelpFaqScreen from "@/components/MobileHelpFaqScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 常見問題 — under 協助中心.
export default function HelpFaqPage() {
  const images = getRenderImageMap();
  return <MobileHelpFaqScreen images={images} />;
}
