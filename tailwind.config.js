import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        // Neutre
        hilight: "#FFD700",
        accent: "#00BFFF",
        primary: "#FF6700",
        'light-secondary': '#3B4E68',
        'dark-secondary': '#253141',

        gray: {
          100: "#F3F4F6", // echivalent light-bg
          200: "#E2E4E9", // echivalent light-bg-2
          300: "#DBDBDB", // echivalent light-gray
          400: "#B6B6B6", // gri deschis mediu
          500: "#8C8C8C", // neutru (mediu)
          600: "#6B7280", // echivalent gray-neutre
          700: "#4B4B4B", // gri închis
          800: "#262626", // echivalent dark-gray/dark-bg-3
          900: "#111111", // echivalent dark-bg
          950: "#0A0A0A", // echivalent dark-black
        },

        info: "#00e4ff",
        success: "#00f989",
        warning: "#ffc700",
        error: "#c12441",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
  ],
  
};
