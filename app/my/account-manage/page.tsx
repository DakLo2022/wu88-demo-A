import MobileAccountManageScreen from "@/components/MobileAccountManageScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 帳戶管理 — under 會員資料.
export default function AccountManagePage() {
  const images = getRenderImageMap();
  return <MobileAccountManageScreen images={images} />;
}
