import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import SideDock from "@/components/SideDock";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import PromoGrid from "@/components/PromoGrid";
import MobileHeader from "@/components/MobileHeader";
import MobileHeroBanner from "@/components/MobileHeroBanner";
import MobileCategoryExplorer from "@/components/MobileCategoryExplorer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { getRenderImageMap } from "@/lib/imageSlotsServer";
import { getSlotPositionMap } from "@/lib/imagePositions";

// Public homepage. Renders two completely separate layouts and lets CSS
// pick one via breakpoint (md = 768px): the original desktop chrome
// (TopBar / Navbar / SideDock / long scrolling page / Footer), and a
// mobile "app shell" (fixed-height header + ticker + hero + a left-rail
// category explorer that fills the rest of the screen + a fixed bottom
// tab bar) modeled on wu88.live's real mobile site. Reads the current slot
// image map + saved positions once per request so uploads from
// /image-manager show up immediately, no rebuild needed.
export default function HomePage() {
  const images = getRenderImageMap();
  const positions = getSlotPositionMap();

  return (
    <>
      {/* Desktop (md and up) */}
      <div className="hidden md:block">
        <div className="sticky top-0 z-50">
          <TopBar images={images} />
          <Navbar images={images} positions={positions} />
        </div>
        <SideDock images={images} />
        <main className="min-h-[60vh]">
          <HeroCarousel images={images} positions={positions} />
          <AnnouncementTicker />
          <PromoGrid images={images} />
        </main>
        <Footer images={images} />
      </div>

      {/* Mobile (below md) — single-screen app shell, no page scroll; only
          the category explorer's two columns scroll internally. */}
      <div className="flex h-[100dvh] flex-col overflow-hidden md:hidden">
        {/* MobileHeader reads useSearchParams() (to detect the `?loggedIn=1`
            redirect from the fake login/register flow), which Next.js
            requires to be wrapped in Suspense so the rest of the page can
            still be statically rendered. */}
        <Suspense fallback={null}>
          <MobileHeader images={images} />
        </Suspense>
        <MobileHeroBanner images={images} positions={positions} />
        <MobileCategoryExplorer images={images} positions={positions} />
        <MobileBottomNav images={images} />
      </div>
    </>
  );
}
