/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070B14',
        foreground: '#F8FAFC',
        card: {
          DEFAULT: 'rgba(15, 23, 42, 0.75)',
          foreground: '#F8FAFC',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        cyber: {
          cyan: '#22D3EE',
          blue: '#38BDF8',
          violet: '#8B5CF6',
          purple: '#A855F7',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          red: '#EF4444',
          dark: '#070B14',
          surface: '#0B1120',
          elevated: '#111C33',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.45)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 20s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
