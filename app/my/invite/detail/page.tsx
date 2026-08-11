import MobileInviteDetailScreen from "@/components/MobileInviteDetailScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 邀請詳情 — confirmed live as its own separate route under 邀請好友
// (wu88.live/invite_friend/detail), reached via the 查看邀請詳情 tab.
export default function InviteDetailPage() {
  const images = getRenderImageMap();
  return <MobileInviteDetailScreen images={images} />;
}
