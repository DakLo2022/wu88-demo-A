import MobileAuthCard from "@/components/MobileAuthCard";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// Mobile-only 會員登入/會員註冊/忘記密碼 route — reached from MobileHeader's
// 登入/註冊 button. No TopBar/Navbar/Footer chrome, matching the real
// wu88.live/user-login mobile page exactly (confirmed live: it's a
// completely standalone screen, not embedded in the home page shell).
export default function LoginPage() {
  const images = getRenderImageMap();
  return <MobileAuthCard images={images} />;
}
