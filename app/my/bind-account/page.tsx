import MobileBindAccountScreen from "@/components/MobileBindAccountScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 綁定帳戶 — reached from the 我的 page's 綁定帳戶 row.
export default function BindAccountPage() {
  const images = getRenderImageMap();
  return <MobileBindAccountScreen images={images} />;
}
