/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "dist/bundle.js"],
  theme: {
    extend: {
      colors: {
        "theme-color": "var(--theme-color)",
        "dark-theme-color": "var(--dark-theme-color)"
      }
    },
  },
  plugins: ["postcss"],
}

