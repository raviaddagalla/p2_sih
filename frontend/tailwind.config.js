/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Controlled explicitly, app will operate in pure light mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design Token Surfaces
        canvas: '#F6F8FC',
        surface: '#FFFFFF',
        subtle: '#EEF2F9',
        inverse: '#0F172A',
        border: {
          DEFAULT: '#E3E8F2',
          strong: '#CBD5E6',
        },
        // Text
        primary: '#0B1220',
        secondary: '#46536B',
        muted: '#7B879C',
        // Brand & Accents (Vivid)
        brand: {
          indigo: '#4F46E5',
          indigoHover: '#4338CA',
          indigoTint: '#EEF0FF',
          cyan: '#06B6D4',
          cyanTint: '#E0F7FB',
          violet: '#8B5CF6',
          violetTint: '#F1EBFF',
          pink: '#EC4899',
          pinkTint: '#FDE8F3',
        },
        // Semantic Status & Tints
        semantic: {
          success: '#10B981',
          successTint: '#DDF7EC',
          successText: '#047857',
          warning: '#F59E0B',
          warningTint: '#FEF1D6',
          warningText: '#B45309',
          high: '#F97316',
          highTint: '#FFE9DA',
          highText: '#C2410C',
          danger: '#EF4444',
          dangerTint: '#FDE4E4',
          dangerText: '#B91C1C',
          info: '#3B82F6',
          infoTint: '#E3EEFF',
          infoText: '#1D4ED8',
        },
        // Chain Brand Colors
        chain: {
          btc: '#F7931A',
          eth: '#627EEA',
          tron: '#EF0027',
          bnb: '#F3BA2F',
          polygon: '#8247E5',
          solana: '#14F195',
          solanaText: '#0FA968',
        },
        // Risk levels backward compatibility
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Plus Jakarta Sans', 'Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(15, 23, 42, 0.06)',
        'md': '0 4px 16px rgba(15, 23, 42, 0.08)',
        'lg': '0 12px 32px rgba(15, 23, 42, 0.12)',
        'focus': '0 0 0 4px rgba(79, 70, 229, 0.18)',
        'card': '0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
      },
      borderRadius: {
        'card': '16px',
        'button': '10px',
        'input': '10px',
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
};
