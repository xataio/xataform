const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx", "./pages/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        header: "max-content auto",
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
