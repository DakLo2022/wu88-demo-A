import { mobileSlotKey } from "@/lib/imageTransform";

type Props = {
  images: Record<string, string | null>;
};

// Mobile-only header: gradient bar (same colors as desktop TopBar), logo on
// the left, a simple "登入/註冊" text link on the right (text only, no icon —
// no username/password fields either; mobile sites in this genre open a
// modal instead, which this demo doesn't need). Hidden on md+ where the
// desktop TopBar/Navbar take over.
export default function MobileHeader({ images }: Props) {
  // Prefer a mobile-specific logo (uploaded via the "手機" tab in
  // /image-manager) if one exists, otherwise fall back to the desktop logo.
  const logoSrc = images[mobileSlotKey("logo")] ?? images["logo"];

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between bg-gradient-to-b from-brand-from to-brand-to px-3">
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="Logo" className="h-8 w-auto max-w-[120px] object-contain" />
      ) : (
        <span className="text-lg font-extrabold text-white">LOGO</span>
      )}
      <button className="text-[13px] font-medium text-white" aria-label="登入或註冊">
        登入/註冊
      </button>
    </header>
  );
}
