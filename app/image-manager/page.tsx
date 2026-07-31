import { IMAGE_SLOTS } from "@/lib/imageSlots";
import { getMobileOnlySlotImageMap, getSlotImageMap } from "@/lib/imageSlotsServer";
import { getSlotPositionMap } from "@/lib/imagePositions";
import ImageManagerClient from "./ImageManagerClient";

export const metadata = {
  title: "圖片欄位管理 - Demo 站台內部工具",
};

// Server Component: check public/images/slots/ at render time for which
// slots already have an upload + any saved drag/scale position, then hand
// that initial state to the Client Component for the interactive parts.
export default function ImageManagerPage() {
  const initialImages = getSlotImageMap();
  const initialMobileImages = getMobileOnlySlotImageMap();
  const initialPositions = getSlotPositionMap();

  return (
    <ImageManagerClient
      slots={IMAGE_SLOTS}
      initialImages={initialImages}
      initialMobileImages={initialMobileImages}
      initialPositions={initialPositions}
    />
  );
}
