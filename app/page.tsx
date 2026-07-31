import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import SideDock from "@/components/SideDock";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import PromoGrid from "@/components/PromoGrid";
import { getSlotImageMap } from "@/lib/imageSlotsServer";
import { getSlotPositionMap } from "@/lib/imagePositions";

// Public homepage — wraps its own content with the site chrome (TopBar /
// Navbar / SideDock / Footer). Reads the current slot image map + saved
// positions once per request so uploads from /image-manager show up
// immediately, no rebuild needed.
export default function HomePage() {
  const images = getSlotImageMap();
  const positions = getSlotPositionMap();

  return (
    <>
      <TopBar images={images} />
      <Navbar images={images} />
      <SideDock />
      <main className="min-h-[60vh]">
        <HeroCarousel images={images} positions={positions} />
        <AnnouncementTicker />
        <PromoGrid images={images} />
      </main>
      <Footer images={images} />
    </>
  );
}
