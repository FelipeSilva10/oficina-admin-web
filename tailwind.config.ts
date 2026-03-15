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
        // Sidebar escura
        sidebar: {
          bg:     "#1a202c",
          hover:  "#2d3748",
          active: "#3182ce",
          text:   "#a0aec0",
          label:  "#4a5568",
        },
        // Superfícies
        surface: {
          page:  "#f0f2f5",
          card:  "#ffffff",
          input: "#ffffff",
        },
        // Primária
        primary: {
          50:  "#ebf8ff",
          100: "#bee3f8",
          500: "#3182ce",
          600: "#2b6cb0",
          700: "#2c5282",
        },
        // Semânticas
        success: { bg: "#f0fff4", text: "#22543d", border: "#9ae6b4" },
        danger:  { bg: "#fff5f5", text: "#c53030", border: "#feb2b2" },
        warn:    { bg: "#fffbeb", text: "#744210", border: "#fbd38d" },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
