import type { Config } from 'tailwindcss'

/**
 * PresyoAni Design System - Shared Tailwind preset
 * Brand colors & fonts for the buyer dashboard
 */
const presyoaniPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Ani-Green - signature brand color
        'ani-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Earth tones for agricultural theme
        'farm': {
          brown: '#8B4513',
          soil: '#D2691E',
          harvest: '#FFD700',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
}

export default presyoaniPreset
