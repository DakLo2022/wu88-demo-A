import MobileHelpTutorialScreen from "@/components/MobileHelpTutorialScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 超商查詢流程 — under 協助中心.
export default function HelpStoreSearchPage() {
  const images = getRenderImageMap();
  return <MobileHelpTutorialScreen images={images} variant="store-search" />;
}
