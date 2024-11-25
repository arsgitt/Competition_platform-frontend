/ @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}', // Adjust the paths according to your project structure
    './public/index.html',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'background': "url('../src/assets/background.jpg')",
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        arsik: ['Inria Serif', 'serif'],
        arsik2: ['Righteous', 'serif'],
      },
    },
  },
  plugins: [],
}