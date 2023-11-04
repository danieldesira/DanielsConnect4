/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "dist/bundle.js"],
  theme: {
    extend: {
      colors: {
        "theme-color": "darkblue",
        "dark-theme-color": "pink"
      },
      borderRadius: {
        "7xl": "45px"
      },
      fontFamily: {
        "sans-pro": "Source-Sans-Pro"
      },
      maxHeight: {
        "screen-1/4": "25vh"
      }
    },
  },
  plugins: ["postcss"],
};