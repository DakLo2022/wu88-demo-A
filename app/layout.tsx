import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demo Site 娛樂平台（內部展示用）",
  description: "內部 Demo 站台，所有資料皆為假資料，無真實後台。",
};

// Minimal root layout — intentionally has NO site chrome (TopBar / Navbar /
// Footer / SideDock) so that internal tools like /image-manager don't
// inherit the public marketing header/footer. The public homepage wraps
// itself with that chrome directly in app/page.tsx.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-brand-dark">{children}</body>
    </html>
  );
}
