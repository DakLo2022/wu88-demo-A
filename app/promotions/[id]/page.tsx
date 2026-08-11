import { notFound } from "next/navigation";
import MobilePromotionDetail from "@/components/MobilePromotionDetail";
import { getMobilePromotionById } from "@/data/mobilePromotions";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 活動內容 (activity detail) — reached by tapping a card on /promotions.
// Deliberately has NO MobileBottomNav at all (per explicit request,
// confirmed live: the real detail view has no app-shell tab bar).
export default function PromotionDetailPage({ params }: { params: { id: string } }) {
  const promotion = getMobilePromotionById(params.id);
  if (!promotion) notFound();

  const images = getRenderImageMap();
  return <MobilePromotionDetail promotion={promotion} images={images} />;
}
