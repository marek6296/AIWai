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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          indigo: "#1C1F3A",
          sand: "#D8B98A",
          offwhite: "#F4F2ED",
          silver: "#E8E8EE",
          glass: "rgba(255, 255, 255, 0.6)",
          glow: "rgba(216, 185, 138, 0.4)",
        },
        ink: "#0A1628",
        "ink-soft": "#131F35",
        gold: "#C9A875",
        "gold-bright": "#E4C896",
        "gold-deep": "#8C6F3F",
        cream: "#F5EDDC",
        bone: "#E8DFD0",
        char: "#0A0A0F",
        "char-soft": "#0E0E14",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-outfit)"],
      },
      letterSpacing: {
        "mega-tight": "-0.045em",
        "mega-wide": "0.35em",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          lg: "2rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1400px",
        },
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -5%)" },
          "30%": { transform: "translate(3%, -8%)" },
          "50%": { transform: "translate(-3%, 5%)" },
          "70%": { transform: "translate(5%, 3%)" },
          "90%": { transform: "translate(-5%, 7%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
        grain: "grain 8s steps(6) infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gold-shine":
          "linear-gradient(100deg, #8C6F3F 0%, #C9A875 25%, #F5EDDC 50%, #C9A875 75%, #8C6F3F 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
