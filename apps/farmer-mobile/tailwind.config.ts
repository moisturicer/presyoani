import type { Config } from 'tailwindcss'
import presyoaniPreset from '@presyoani/config/tailwind-preset'

export default {
  presets: [presyoaniPreset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
} satisfies Config
