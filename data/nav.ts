import { footerGroups } from "./footerLinks";

export type NavCategory = {
  key: string;
  label: string;
  icon?: string;
  providers: string[];
};

function providersFor(title: string, fallback: string[]): string[] {
  return footerGroups.find((g) => g.title === title)?.links ?? fallback;
}

// Nav categories + their provider lists (used both for the desktop nav bar
// and for the hover dropdown panel). Provider names are reused from
// footerLinks.ts so the nav dropdown and footer sitemap stay in sync.
export const navCategories: NavCategory[] = [
  { key: "hot", label: "熱門", icon: "🔥", providers: ["SUPER體育", "戰神賽特2", "麻將發了"] },
  { key: "slots", label: "電子", providers: providersFor("電子", ["示範電子 A", "示範電子 B"]) },
  { key: "sports", label: "體育", providers: providersFor("體育", ["示範體育 A", "示範體育 B"]) },
  { key: "live", label: "真人", providers: providersFor("真人", ["示範真人 A", "示範真人 B"]) },
  { key: "lottery", label: "彩球", providers: providersFor("彩球", ["示範彩球 A", "示範彩球 B"]) },
  { key: "cards", label: "棋牌", providers: providersFor("棋牌", ["示範棋牌 A", "示範棋牌 B"]) },
  { key: "fishing", label: "捕魚", providers: providersFor("捕魚", ["示範捕魚 A", "示範捕魚 B"]) },
  { key: "esports", label: "電競", providers: providersFor("電競", ["示範電競 A"]) },
];

export const promoNavLabel = "優惠活動";
