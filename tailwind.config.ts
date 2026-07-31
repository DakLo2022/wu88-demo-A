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
          orange: "#f5820c",
          orangeDark: "#e06b00",
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
