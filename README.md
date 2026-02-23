# PresyoAni

**PresyoAni** (meaning *Harvest Price*) is an **offline-first** digital assistant for rural smallholder farmers in the Philippines. It helps farmers **verify harvest quality**, **see fair market prices**, and **connect directly to buyers**—even in areas with **little to no internet signal**.

**SDG Alignment:** **SDG 8 – Decent Work and Economic Growth**  
**Tagline:** *Empower farmers offline. Sell fairly online.*

---

## Problem

Smallholder farmers—who power much of the Philippine food supply—often sell at unfair prices due to:

- **Lack of market transparency**: No reliable access to current wholesale prices during negotiation.
- **Connectivity barriers**: Many agri-tech tools fail in rural “dead zones.”
- **Weak negotiation power**: No verifiable proof of crop quality/quantity at point of harvest.
- **Inefficient harvest decisions**: Limited visibility into demand or pricing trends.
- **Dependence on informal middlemen (compradors)**: Exploits information asymmetry and keeps farmers in income instability.

---

## One-Sentence Solution

**PresyoAni empowers rural smallholder farmers with an offline-capable assistant that verifies harvest quality, delivers price transparency, and connects them directly to buyers—even with no network coverage.**

---

## Target Users / Beneficiaries

### Primary
- **Smallholder farmers in last-mile rural communities** with intermittent or no connectivity.

### Secondary
- **Institutional buyers & FMCG corporations** seeking verifiable ethical sourcing and supply transparency.
- **LGUs and policymakers** using localized crop, yield, and price data for planning and stabilization.
- **Agricultural cooperatives** improving bargaining power through aggregated harvest intelligence.

---

## Proposed MVP (Hackathon Scope)

A lightweight **Progressive Web App (PWA)** that works after being opened once, supports **on-device crop grading**, stores records locally, and syncs when signal returns.

### Key Features

- **Offline-First PWA (Works Without Wi‑Fi)**
  - Open the app link once; it stays usable with offline assets and cached data.
  - Designed for low-end devices and rural conditions.

- **Smart Camera (Edge AI Crop Grading)**
  - Take a photo of harvest; the app identifies the crop and estimates **Grade A/B/C**.
  - Runs **on-device** (no upload required), enabling use in total dead zones.

- **Digital Notebook (Local Harvest Records)**
  - Replaces paper logs with secure local storage for:
    - harvest photos
    - timestamps
    - GPS (when available)
    - quantity and notes

- **Fair Price Checker**
  - Shows benchmark city market prices (cached/updated when connection is available).
  - Helps farmers negotiate better and avoid being underpaid by middlemen.

- **Buyer Map / Heatmap View**
  - Buyers can view what’s available by crop, grade, and location to plan sourcing and logistics.

- **Auto‑Sync & SMS Alerts (“Asynchronous Handshake”)**
  - When signal returns, the app syncs records automatically.
  - Interested buyers trigger **SMS notifications** to farmers for immediate negotiation.

- **Multi‑Dialect Support**
  - Interface designed for accessibility (e.g., **Tagalog**, **Cebuano**) to reduce digital friction.

---

## What Makes PresyoAni Different

PresyoAni isn’t “just another marketplace.” It’s **resilient rural data infrastructure** built for real last-mile constraints:

- **Offline-first AI grading** (Edge AI) in signal-dead zones
- **Reverses information asymmetry** with cached & updated price benchmarks
- **Asynchronous farmer–buyer bridge** using SMS (works on weak connectivity)
- **Free for farmers** (B2B monetization model)
- **Creates digital credit profiles** via objective harvest records (future-ready for loans/insurance)
- **Offline-ready verification** with timestamped grading evidence to reduce disputes

---

## Impact

- **Higher farmer income** through better negotiation and reduced exploitation
- **Stronger rural economy** by keeping value closer to producers and cooperatives
- **Fairer consumer food prices** by reducing unnecessary layers of middlemen fees
- **Less food waste** via visibility into supply and better planning for distribution

---

## Success Metrics

- **Economic Growth:** average increase in farmer take-home pay per harvest
- **Decent Work:** number of farmers shifting from informal “handshake” deals to documented digital sales records
- **Digital Inclusion:** number of last-mile barangays reached where online-first apps fail

---

## Revenue Model (Planned)

- **Marketplace matching fees** (paid by bulk buyers)
- **Corporate ESG subscriptions** for verifiable ethical sourcing reports
- **Government data access** for food security and price stabilization insights
- **Cooperative management SaaS** dashboards for aggregated member harvest tracking

---

## Existing Alternatives (and the Gap PresyoAni Fills)

- **Online-first marketplaces (e.g., Mayani):** strong in connected areas, weak in dead zones  
  → PresyoAni works offline with asynchronous sync.

- **Diagnostics tools (e.g., Plantix):** focus on pre-harvest crop health  
  → PresyoAni focuses on *post-harvest grading, pricing, and selling*.

- **Traditional middlemen (compradors):** exploit price opacity  
  → PresyoAni restores fairness through benchmark prices + verified grading.

---

## Tech Stack (MVP)

PresyoAni is built as an **offline-first PWA** with **on-device AI** and lightweight cloud sync.

- **PWA App Shell:** React + Vite
- **Offline Storage:** IndexedDB (Dexie.js)
- **Edge AI (On-device):** TensorFlow.js (lightweight model / heuristics)
- **Sync Engine:** network listeners + API relay; foreground/manual sync option included
- **Backend (lightweight):** Firebase / Supabase (synced harvest records and buyer profiles)
- **Buyer Dashboard:** Next.js + Tailwind (read-only availability / heatmap)
- **SMS Handshake:** Twilio SMS API (buyer interest → farmer SMS; replies logged)
- **Price Data (MVP):** simulated dataset / curated CSV (scraping deferred post-MVP)

---

## Quick Pitch

PresyoAni is an **offline-first harvest pricing and verification assistant** that gives farmers:
1) **proof of crop quality** (on-device grading),  
2) **price transparency** (benchmark market prices), and  
3) a way to **sell directly to buyers** (sync + SMS)  
—designed specifically for communities where typical “online-only” platforms fail.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.