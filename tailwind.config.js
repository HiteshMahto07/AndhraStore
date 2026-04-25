/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4faeb',
          100: '#e5f4d2',
          200: '#cee9a8',
          300: '#aed976',
          400: '#92c74e',
          500: '#74A822',
          600: '#5a8716',
          700: '#456714',
          800: '#385215',
          900: '#304515',
        },
        olive: {
          50: '#F8FAF5',
          100: '#EEF2E6',
          200: '#DAE4C8',
          300: '#B8CC93',
          400: '#8FB05B',
          500: '#6B8E3A',
          600: '#4F6B28',
          700: '#3D5320',
          800: '#2D3E17',
          900: '#1F2E10',
        },
        cream: '#FDF8F0',
        sand: '#F5EFDE',
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
      },
    },
  },
  plugins: [],
};
