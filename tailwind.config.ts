import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // These 4 map straight to CSS variables set in globals.css. To
          // re-skin this template for a different site, only these 4 values
          // need to change (see :root in app/globals.css) — no component
          // files need to be touched.
          from: "var(--brand-from)",
          to: "var(--brand-to)",
          accent: "var(--brand-accent)",
          accentDark: "var(--brand-accent-dark)",
          // Neutral dark-theme chrome — shared across every site variant.
          dark: "#1a1a1a",
          darker: "#141414",
          panel: "#232323",
        },
      },
    },
  },
  plugins: [],
};

export default config;
