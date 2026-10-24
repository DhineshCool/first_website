/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: {
          DEFAULT: '#161E31',
          light: '#1e293b',
          glass: 'rgba(22, 30, 49, 0.75)',
        },
        accent: {
          primary: '#F43F5E',
          secondary: '#F59E0B',
          highlight: '#EC4899',
        },
        tprimary: '#F8FAFC',
        tmuted: '#94A3B8',
      },
      fontFamily: {
        heading: ['Cinzel', 'Playfair Display', 'serif'],
        body: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.35)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.35)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.4)',
        'polaroid': '0 12px 35px -8px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'wax-seal': 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 14px rgba(0,0,0,0.6)',
      },
      animation: {
        'float-slow': 'floating 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flame-flicker': 'flame 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', borderColor: 'rgba(244, 63, 94, 0.4)' },
          '50%': { opacity: '0.7', borderColor: 'rgba(245, 158, 11, 0.3)' },
        },
        flame: {
          '0%': { transform: 'scale(1) skewX(-1deg)' },
          '50%': { transform: 'scale(1.08, 0.95) skewX(2deg)' },
          '100%': { transform: 'scale(0.96, 1.05) skewX(-2deg)' },
        }
      }
    },
  },
  plugins: [],
}
