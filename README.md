# PresyoAni

Offline-first mobile-primary and desktop app for farmers. Empowers rural smallholder farmers with harvest grading, price transparency, and direct buyer connections—even in areas with no network coverage.

## Project Structure

```
presyo-ani/
├── apps/
│   ├── farmer-mobile/       # React + Vite + TS (Offline PWA)
│   └── buyer-dashboard/     # Next.js + TS (Desktop Portal)
├── packages/
│   ├── ui/                  # Shared Tailwind components (Ani Design System)
│   └── config/              # Shared Tailwind/TypeScript configs
├── package.json
└── turbo.json
```

## Quick Start

**Run all commands from the repo root** (`PresyoAni/`), not from `PresyoAni/PresyoAni/`.

```bash
# From repo root (PresyoAni/)
npm install

# Run farmer mobile app (PWA) → http://localhost:5173
npm run dev:mobile

# Run buyer dashboard → http://localhost:3000
npm run dev:dashboard

# Run all apps
npm run dev
```

## Apps

### Farmer Mobile (`apps/farmer-mobile`)
- **Field Screen**: Smart Camera (Edge AI) for crop grading
- **Audit Screen**: Digital Notebook (local harvest records)
- **Insight Screen**: Fair Price Checker (cached market prices)
- **Alerts Screen**: SMS notifications when buyers are interested

### Buyer Dashboard (`apps/buyer-dashboard`)
- **Heatmaps**: Harvest availability by location
- **Analytics**: Supply data tables

## Packages

- **@presyoani/ui**: Buttons, cards, crop icons (Ani-Green design system)
- **@presyoani/config**: Shared Tailwind preset, tsconfig base

## Tech Stack

- React 19 + Vite (farmer-mobile)
- Next.js 15 (buyer-dashboard)
- Tailwind CSS
- PWA (vite-plugin-pwa)
- TypeScript
