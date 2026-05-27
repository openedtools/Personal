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
        // High fidelity dark mode colors
        dark: {
          950: '#020617', // deepest blue-black
          900: '#0f172a', // deep slate
          800: '#1e293b', // medium slate
          700: '#334155', // light slate
          600: '#475569',
        },
        mastery: {
          'not-started': '#64748b', // slate
          'exposed': '#cbd5e1',     // light slate
          'weak': '#f87171',        // light red
          'developing': '#fb923c',  // light orange
          'proficient': '#facc15',  // light yellow
          'exam-ready': '#60a5fa',  // light blue
          'mastered': '#34d399',    // emerald
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      }
    },
  },
  plugins: [],
}
