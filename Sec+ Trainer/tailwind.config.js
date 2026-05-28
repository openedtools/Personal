/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        // High fidelity warm paper cream & stone palette (inverted slate)
        slate: {
          50: '#0c0a09',
          100: '#141210',
          200: '#1c1a18', // deep headings
          300: '#2d2925', // headings / active text
          400: '#4d473f', // body text
          450: '#5a544b',
          500: '#726a5c', // secondary text
          600: '#908678', // secondary icons / muted text
          700: '#b4ab9e',
          800: '#dbd7cd', // soft borders
          850: '#e5e1d7',
          900: '#f4f1e8', // light background (paper cream)
          950: '#fbf9f4', // card background (pure warm cream)
        },
        // Terracotta & Smoky Blue accents
        indigo: {
          50: '#fcf8f6',
          100: '#faeff9',
          200: '#f5d5cc',
          300: '#eeb2a2',
          400: '#54758d', // smoky blue accent
          500: '#d66b4d', // terracotta (hover)
          600: '#b24a2e', // terracotta (primary)
          650: '#466277', // smoky blue (darker)
          700: '#923c24', // terracotta (dark)
          800: '#732f1c',
          900: '#552113',
        },
        mastery: {
          'not-started': '#827c72', // muted stone
          'exposed': '#a1998f',     // light stone
          'weak': '#cc6650',        // warm terracotta-red
          'developing': '#d6835a',  // warm clay orange
          'proficient': '#cc9f43',  // warm mustard yellow
          'exam-ready': '#54758d',  // smoky blue
          'mastered': '#5b8e72',    // sage green
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(144, 134, 120, 0.15)',
        'premium': '0 10px 30px -10px rgba(144, 134, 120, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
      }
    },
  },
  plugins: [],
}
