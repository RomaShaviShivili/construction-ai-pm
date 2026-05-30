/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1a2234',
          950: '#0c1018',
        },
        brand: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.18)',
        glow: '0 0 40px rgba(14, 165, 233, 0.15)',
      },
    },
  },
  plugins: [],
};
