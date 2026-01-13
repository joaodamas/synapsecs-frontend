/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cs: {
          dark: '#0a0a0c',
          card: '#16161a',
          orange: '#ff6b00',
          red: '#e11d48'
        },
        'synapse-black': '#050505',
        'synapse-dark': '#121212',
        'synapse-neon': '#39FF14',
        'synapse-gray': '#888888'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeUp: 'fadeUp 0.6s ease-out both'
      },
      boxShadow: {
        neon: '0 0 15px rgba(57, 255, 20, 0.3)'
      }
    }
  },
  plugins: []
};
