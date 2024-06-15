/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["coffee", "retro", "cyberpunk", "graden", "aqua", "dark", "cmyk"]
  },
  plugins: [
    require('daisyui'),
  ],
}

