import MobileInviteScreen from "@/components/MobileInviteScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 邀請好友 — reached from the 我的 page's 邀請好友 row.
export default function InvitePage() {
  const images = getRenderImageMap();
  return <MobileInviteScreen images={images} />;
}
