import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gb: {
          bg: "#1E1440",
          surface: "#271D4A",
          raised: "#312756",
          raisedHi: "#3B3162",
          border: "#453B6E",
          borderHi: "#554B7E",
          primary: "#7B35FF",
          bright: "#9B6DFF",
          primDim: "#4A1FCC",
          accent: "#CCFF00",
          accentDim: "#99BF00",
          cyan: "#00F5FF",
          fg: "#F0EEFF",
          fg2: "#B0A8CC",
          fg3: "#8080A0",
          fgInv: "#1E1440",
          success: "#22FF88",
          danger: "#FF3366",
          warning: "#FFB800",
        },
      },
      fontFamily: {
        disp: ["var(--font-bebas-neue)", "sans-serif"],
        head: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;