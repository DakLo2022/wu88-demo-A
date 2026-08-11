import MobileSecurityPasswordScreen from "@/components/MobileSecurityPasswordScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

export default function SecurityLoginPasswordPage() {
  const images = getRenderImageMap();
  return <MobileSecurityPasswordScreen images={images} title="修改登入密碼" />;
}
