/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffffffff',     // Main background
        secondary: '#e5e3e1',   // Secondary background
        accent: '#44413c',      // Highlights / buttons / icons
        text: '#57534e',        // Main text color
        danger: '#dd2722',      // Error messages
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],  // UI font
        code: ['Fira Code', 'monospace'], // Code blocks
      },
    },
  },
  plugins: [],
}
