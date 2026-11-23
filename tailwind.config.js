/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['Nunito', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        pop: '4px 4px 0 0 #0f172a',
        'pop-sm': '3px 3px 0 0 #0f172a',
        'pop-green': '4px 4px 0 0 #86efac',
        'pop-cyan': '4px 4px 0 0 #a7f3d0',
        'pop-pink': '4px 4px 0 0 #ec4899',
        'pop-lime': '4px 4px 0 0 #bef264',
        'pop-amber': '4px 4px 0 0 #f59e0b',
        'pop-red': '4px 4px 0 0 #ef4444',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        'float-soft': 'float-soft 3s ease-in-out infinite',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'bounce-soft': 'bounce-soft 0.5s ease',
      },
    },
  },
  plugins: [],
};
