/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        nude: {
          50: '#fdf8f4',
          100: '#f7ede3',
          200: '#edd8c4',
          300: '#deba9a',
          400: '#c99a72',
          500: '#b67d52',
          600: '#9a6340',
          700: '#7d4e32',
          800: '#5e3a25',
          900: '#3d2518',
        },
        warm: {
          50: '#faf6f3',
          100: '#f3ebe4',
          200: '#e8d8cc',
          300: '#d4b9a5',
          400: '#bc9278',
          500: '#a67558',
          600: '#8a5e44',
          700: '#6e4a35',
          800: '#523827',
          900: '#35241a',
        },
        surface: {
          900: '#0f0d0b',
          800: '#1a1714',
          700: '#252118',
          600: '#302b21',
          500: '#3d352a',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
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
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
