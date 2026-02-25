/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5722', // Orange as requested in previous conversation context or just a good retail color
        secondary: '#212121',
      }
    },
  },
  plugins: [],
}
