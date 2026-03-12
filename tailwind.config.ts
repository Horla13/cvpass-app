import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-plus-jakarta)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        brand: {
          green: "#16a34a",
          black: "#111827",
          gray: "#6b7280",
        },
      },
    },
  },
  plugins: [],
};
export default config;
