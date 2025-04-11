/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: [
    "./index.html",                  // Main HTML entry
    "./src/**/*.{vue,js,ts,jsx,tsx}", // All Vue + JS/TS components in src
    "./node_modules/flowbite/**/*.js" // Optional: if using Flowbite
  ],
  theme: {
    extend: {
      colors: {
        gold: "#FBD0A0",
        yellow: "#FF9900",
      },
      fontFamily: {
        exo: ['"Exo 2"', "sans-serif"],
        outfit: ['"Outfit"', "sans-serif"],
        custom: [
          '"Trebuchet MS"',
          '"Lucida Sans Unicode"',
          '"Lucida Grande"',
          '"Lucida Sans"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  safelist: [
    "bg-gradient-to-r",
    "from-sky-400",
    "to-sky-600",
    "from-lime-400",
    "to-lime-600",
    "from-cyan-600",
    "to-cyan-800",
    "from-emerald-400",
    "to-emerald-600",
    "font-mono",
    "font-serif",
    "font-elegant",
    "font-classic",
    "font-sans",
    "font-exo",
    "font-custom",
    "font-outfit",
    "ring-cyan-500",
    "ring-sky-500",
    "ring-emerald-500",
    "ring-lime-500",
    "bg-black",
    "text-gold",
    "ring-gold",
  ],
  plugins: [daisyui],
  darkMode: "class",
  daisyui: {
    darkTheme: true,
  },
};
