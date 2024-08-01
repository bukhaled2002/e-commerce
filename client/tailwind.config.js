/* eslint-disable */
/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
  ],

  // enable dark mode via class strategy
  darkMode: "class",

  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),

    require("@tailwindcss/forms")({
      strategy: "base", // only generate global styles
      strategy: "class", // only generate classes
    }),
    require("preline/plugin"),
  ],
};
