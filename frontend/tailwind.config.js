/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Urbanist"', 'sans-serif'],
      },
      colors: {
        primary: {
          dark: '#0b2f77',      // Deep dark blue
          teal: '#12c3cc',      // Vibrant teal
          orange: '#e56c1a',    // Bright orange
        },
        // Aliases for easier use
        'dentist-dark': '#0b2f77',
        'dentist-teal': '#12c3cc',
        'dentist-orange': '#e56c1a',
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}
