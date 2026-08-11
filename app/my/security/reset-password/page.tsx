import MobileSecurityResetScreen from "@/components/MobileSecurityResetScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

export default function SecurityResetPasswordPage() {
  const images = getRenderImageMap();
  return <MobileSecurityResetScreen images={images} />;
}
