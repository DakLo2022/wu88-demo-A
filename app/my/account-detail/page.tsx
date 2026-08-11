import MobileAccountDetailScreen from "@/components/MobileAccountDetailScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 帳戶明細 — shared tabbed page for 5 of the row's 6 menu sub-items
// (交易明細/轉點明細/活動點數/商城點數/其他明細), deep-linkable via ?tab=.
export default function AccountDetailPage() {
  const images = getRenderImageMap();
  return <MobileAccountDetailScreen images={images} />;
}
