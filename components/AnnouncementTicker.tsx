import { announcements } from "@/data/promos";

// Scrolling marquee, its own row directly under the hero banner (no overlap,
// no gap). Only ONE "公告" tag is shown, pinned at the left; the marquee
// itself just scrolls the announcement texts joined together.
export default function AnnouncementTicker() {
  const combinedText = announcements.map((a) => a.text).join("　|　");

  return (
    <div className="flex items-center overflow-hidden border-b border-white/10 bg-black py-2">
      <span className="ml-4 flex-shrink-0 rounded bg-brand-orange/80 px-1.5 py-0.5 text-xs text-white">
        公告
      </span>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="marquee-track flex w-max whitespace-nowrap text-xs text-white/80">
          <span className="pr-10">{combinedText}</span>
          <span className="pr-10">{combinedText}</span>
        </div>
      </div>
    </div>
  );
}
