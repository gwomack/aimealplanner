
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#141414",
        foreground: "#FAFAFA",
        primary: {
          DEFAULT: "#569CD6",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#A6A6A6",
          foreground: "#FAFAFA",
        },
        destructive: {
          DEFAULT: "#F44747",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          foreground: "#A6A6A6",
        },
        accent: {
          DEFAULT: "#CE9178",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#141414",
          foreground: "#FAFAFA",
        },
        popover: {
          DEFAULT: "#1E1E1E", // Added darker background for dropdowns
          foreground: "#FAFAFA",
        },
        success: "#6A9955",
        warning: "#CE9178",
        error: "#F44747",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: "2rem",
        h2: "1.5rem",
        body: "1rem",
        small: "0.875rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
