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
          bg: "#080810",
          surface: "#12121E",
          raised: "#1C1C2E",
          raisedHi: "#22223A",
          border: "#2A2A40",
          borderHi: "#3A3A55",
          primary: "#7B35FF",
          bright: "#9B6DFF",
          primDim: "#4A1FCC",
          accent: "#CCFF00",
          accentDim: "#99BF00",
          cyan: "#00F5FF",
          fg: "#F0EEFF",
          fg2: "#B0A8CC",
          fg3: "#8080A0",
          fgInv: "#080810",
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