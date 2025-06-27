/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: '#FF6347', // Tomato Red
      secondary: '#FFC107', // Warm Yellow
      neutral: '#FFF8F0', // Cream White
      accent: '#4A7043', // Olive Green
      text: '#2D2D2D', // Charcoal
      error: '#EF4444', // Soft Red
      success: '#22C55E', // Light Green
      white: '#ffffff', // Needed for bg-white
      black: '#000000', // Needed for text-black, etc.
      transparent: 'transparent',
      current: 'currentColor',
    },
  },
  plugins: [],
};
