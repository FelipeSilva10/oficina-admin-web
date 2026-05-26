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
        sidebar: {
          bg:     "#0f172a",
          border: "rgba(255,255,255,0.05)",
          hover:  "rgba(255,255,255,0.05)",
          text:   "#94a3b8",
          label:  "#475569",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        sm:   "6px",
        DEFAULT: "10px",
        lg:   "14px",
        xl:   "18px",
        "2xl":"24px",
      },
      boxShadow: {
        xs:  "0 1px 2px 0 rgba(0,0,0,0.04)",
        sm:  "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)",
        md:  "0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)",
        lg:  "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)",
        xl:  "0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.06)",
        panel: "0 4px 24px -4px rgba(0,0,0,0.12), 0 2px 6px -2px rgba(0,0,0,0.06)",
        card:  "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 20px -4px rgba(0,0,0,0.10), 0 2px 6px -2px rgba(0,0,0,0.05)",
      },
      animation: {
        "slide-in-right": "slideInRight 180ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-up":        "fadeUp 220ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in":        "fadeIn 200ms ease",
        "scale-in":       "scaleIn 180ms cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-dot":      "pulseDot 1.5s ease-in-out infinite",
        "shimmer":        "shimmer 1.5s infinite",
      },
      keyframes: {
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.5", transform: "scale(0.85)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
      },
      transitionDuration: {
        "250": "250ms",
      },
      spacing: {
        "dvh": "100dvh",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;