import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // pastel accents
        mint: "hsl(var(--mint))",
        peach: "hsl(var(--peach))",
        sky: "hsl(var(--sky))",
        lilac: "hsl(var(--lilac))",
        blush: "hsl(var(--blush))",
        butter: "hsl(var(--butter))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 6px)",
        sm: "calc(var(--radius) - 12px)",
        clay: "1.75rem",
      },
      boxShadow: {
        clay: "0 14px 30px -10px hsl(var(--clay-shadow) / 0.45), inset 0 -6px 12px -4px hsl(var(--clay-shadow) / 0.30), inset 0 8px 12px -4px rgba(255,255,255,0.9)",
        "clay-sm": "0 8px 18px -8px hsl(var(--clay-shadow) / 0.40), inset 0 -4px 8px -3px hsl(var(--clay-shadow) / 0.25), inset 0 5px 8px -3px rgba(255,255,255,0.9)",
        "clay-inset": "inset 0 3px 7px hsl(var(--clay-shadow) / 0.35), inset 0 -2px 4px rgba(255,255,255,0.7)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "blob": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(24px,-18px) scale(1.08)" },
          "66%": { transform: "translate(-18px,14px) scale(0.96)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 5s ease-in-out infinite",
        blob: "blob 16s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
