import MobileSecurityPasswordScreen from "@/components/MobileSecurityPasswordScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

export default function SecurityConsignPasswordPage() {
  const images = getRenderImageMap();
  return <MobileSecurityPasswordScreen images={images} title="修改託售密碼" />;
}
