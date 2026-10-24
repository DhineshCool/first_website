/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scrapbook: {
          cream: '#FAF6F0',
          maroon: '#801336',
          'maroon-dark': '#5c0d26',
          'maroon-light': '#9e1b43',
          pink: '#F49CB4',
          'pink-soft': '#FCE4EC',
          'pink-tint': '#F8BBD0',
          tan: '#E8D8C8',
          paper: '#FFFDF9',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        dancing: ['"Dancing Script"', 'cursive'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'scrapbook-card': '0 10px 30px -5px rgba(128, 19, 54, 0.12), 0 0 1px 1px rgba(128, 19, 54, 0.05)',
        'polaroid-scrap': '0 8px 25px -4px rgba(128, 19, 54, 0.15), 0 2px 6px -1px rgba(0, 0, 0, 0.06)',
        'pill-maroon': '0 4px 14px rgba(128, 19, 54, 0.25)',
        'pill-pink': '0 4px 14px rgba(244, 156, 180, 0.35)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
