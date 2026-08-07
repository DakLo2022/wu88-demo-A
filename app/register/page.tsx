import RegisterForm from "@/components/RegisterForm";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// Standalone 免費註冊 (加入會員) page — no TopBar/Navbar/Footer, matching the
// real pc.wu88.live/user-login route exactly (confirmed via live DOM check:
// the page renders with no site chrome at all, just a centered card over a
// full-bleed background).
export default function RegisterPage() {
  const images = getRenderImageMap();
  return <RegisterForm images={images} />;
}
