import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Building2,
  Camera,
  MapPin,
  MessageSquare,
  Globe,
  Leaf,
  Lightbulb,
  MessageCircle,
  Shield,
  Smartphone,
  Target,
  Users,
  WifiOff,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About the Project | PresyoAni',
  description:
    'PresyoAni – Innovation Cup Cebu hackathon project: empowering rural farmers with offline-first tools, fair prices, and direct buyer connections.',
}

const sectionCardClass =
  'rounded-2xl border border-primary/10 bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8'

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Innovation Cup Cebu
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        {/* Hero */}
        <section className="mb-14 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            PresyoAni
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-foreground">
            <Target className="h-4 w-4 text-secondary" aria-hidden />
            SDG 8 – Decent Work and Economic Growth
          </p>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-muted-foreground">
            Empowering rural smallholder farmers with an offline-capable digital assistant that verifies harvest quality, delivers price transparency, and connects them directly to buyers—even in areas with no network coverage.
          </p>
        </section>

        {/* Problem Statement */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden />
            Problem Statement
          </h2>
          <div className={sectionCardClass}>
            <p className="leading-relaxed text-muted-foreground">
              Smallholder farmers, who form the backbone of the Philippine food supply, remain trapped in a cycle of unfair price gaps and digital exclusion. In rural areas, the lack of real-time market data allows intermediaries (compradors) to dictate prices, often buying harvests far below wholesale value. Existing digital marketplaces fail to reach these farmers because they require reliable internet signals that are simply unavailable in remote agricultural zones. Without access to tools that verify crop quality or show benchmark prices at the point of harvest, farmers are forced into urgent, low-priced sales, resulting in persistent income instability and the continuation of exploitative trading systems.
            </p>
          </div>
        </section>

        {/* Target Users */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Users className="h-5 w-5 text-primary" aria-hidden />
            Target Users / Beneficiaries
          </h2>
          <div className={`${sectionCardClass} space-y-4`}>
            <div>
              <h3 className="font-medium text-foreground">Primary Beneficiaries</h3>
              <p className="mt-1 text-muted-foreground">
                Smallholder farmers in &quot;last-mile&quot; rural regions who lack consistent data connectivity and are currently dependent on traditional intermediary-led sales.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Secondary Beneficiaries</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Institutional buyers and FMCG corporations that gain access to a verifiable farm-to-shelf supply chain, supporting ethical sourcing and sustainability reporting through harvest heatmaps</li>
                <li>LGUs and policymakers who leverage localized crop, yield, and price data to enable data-driven budget decisions and market stabilization</li>
                <li>Agricultural cooperatives that combine harvest data to strengthen bargaining power and manage bulk deliveries</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Lightbulb className="h-5 w-5 text-primary" aria-hidden />
            Current Pain Points
          </h2>
          <ul className="grid gap-3 sm:grid-cols-1">
            {[
              'Lack of Market Transparency: Farmers have limited or delayed access to accurate wholesale price information, forcing them to rely on intermediaries during price negotiation.',
              'Connectivity Barriers: Most existing agri-tech and marketplace solutions fail in areas with intermittent or weak mobile signal, excluding the most vulnerable farmers.',
              'Weak Negotiation Power: Farmers lack verifiable documentation of crop quality and quantity at the time of sale, reducing their ability to justify fair prices.',
              'Inefficient Harvest Decisions: Without visibility into demand or pricing trends, farmers harvest without market signals, increasing wasted crops and unpredictable earnings.',
              'Informal Market Dependence: The absence of accessible digital records reinforces reliance on informal trading practices and makes it harder to join more organized markets.',
            ].map((item, i) => (
              <li key={i} className={sectionCardClass}>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* One-Sentence Solution */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <MessageCircle className="h-5 w-5 text-primary" aria-hidden />
            One-Sentence Solution
          </h2>
          <div className={`${sectionCardClass} border-primary/20 bg-primary/5`}>
            <p className="text-lg font-medium leading-relaxed text-foreground">
              PresyoAni empowers rural smallholder farmers by providing an offline-capable digital assistant that verifies harvest quality, delivers price transparency, and connects them directly to buyers, even in areas with no network coverage.
            </p>
          </div>
        </section>

        {/* Proposed MVP */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Smartphone className="h-5 w-5 text-primary" aria-hidden />
            Proposed MVP
          </h2>
          <div className={`${sectionCardClass} space-y-6`}>
            <p className="leading-relaxed text-muted-foreground">
              PresyoAni (meaning Harvest Price) is an app for farmers that works even in remote areas with no signal. It helps farmers grade their crops, see fair market prices so they do not get cheated, and sell directly to big city buyers.
            </p>
            <div>
              <h3 className="mb-3 font-medium text-foreground">Key Features</h3>
              <ul className="space-y-3">
                {[
                  { icon: WifiOff, title: 'Works Without Wi-Fi', text: 'Farmers do not need to download a heavy file from an app store. By simply opening a link once, the app stays on the phone and continues to work perfectly even without data or an internet connection.' },
                  { icon: Camera, title: 'Smart Camera (Edge AI)', text: 'When a farmer takes a photo of their harvest, the app instantly identifies the crop and determines if it is Grade A, B, or C. This happens right in the field with no signal required.' },
                  { icon: BookOpen, title: 'Digital Notebook', text: 'This feature replaces paper logs that can be lost or ruined. Every recorded harvest is saved safely in the phone\'s memory, ensuring that data is protected even in areas with zero reception.' },
                  { icon: BarChart3, title: 'Fair Price Checker', text: 'The app monitors the latest city market prices and informs the farmer of the current value of their crops. This helps them negotiate better and avoid being underpaid by middlemen.' },
                  { icon: MapPin, title: 'Buyer Map', text: 'Wholesale buyers, such as restaurants and supermarkets, use this map to see exactly what is available for sale. They can check crop quality and locations before they even begin the trip to the province.' },
                  { icon: MessageSquare, title: 'Auto-Sync & Text Alerts', text: 'As soon as the phone catches even a weak signal, the app automatically sends the harvest information to the system. If a buyer is interested, the farmer receives a standard text message (SMS) so they can talk immediately.' },
                  { icon: Globe, title: 'Multi-Dialect Support', text: 'To make the tool accessible to everyone, the interface is available in local languages like Tagalog and Cebuano, ensuring it is easy for every farmer to understand and use.' },
                ].map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3 rounded-xl border border-border/50 bg-muted/30 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <span className="font-medium text-foreground">{title}</span>
                      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Revenue Model */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Building2 className="h-5 w-5 text-primary" aria-hidden />
            Proposed Revenue Model
          </h2>
          <ul className="space-y-3">
            {[
              'Marketplace Matching Fees: Big buyers pay a small fee whenever the app helps them find and buy large amounts of crops directly from farmers.',
              'Corporate ESG Subscriptions: Large companies pay a monthly fee for digital reports that prove they are buying fairly from small farmers, helping them show they are meeting their green goals.',
              'Government Data Access: Government Agencies (Department of Agriculture) pay to access a live map of where crops are being grown. This helps them stop price spikes and manage food supplies better.',
              'Cooperative Management SaaS: Agricultural cooperatives pay a small monthly fee for a digital dashboard. It helps them track all their members\' crops in one place so they can negotiate better prices.',
            ].map((item, i) => (
              <li key={i} className={sectionCardClass}>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Success Measure */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Target className="h-5 w-5 text-primary" aria-hidden />
            Success Measure
          </h2>
          <ul className="flex flex-wrap gap-3">
            {[
              'Economic Growth: Average increase in farmer take-home pay per harvest.',
              'Decent Work: Number of farmers transitioned from informal "handshake" to documented digital sales records.',
              'Digital Inclusion: Number of "Last-Mile" barangays reached where traditional apps fail.',
            ].map((item, i) => (
              <li key={i} className={sectionCardClass}>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Impact */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Leaf className="h-5 w-5 text-primary" aria-hidden />
            Impact
          </h2>
          <ul className="space-y-3">
            {[
              'Higher Income for Farmers: By knowing real city prices, farmers can negotiate better and avoid being cheated. This extra profit goes directly to their families for food, school, and better farming tools.',
              'Stronger Rural Economy: Money stays in the province instead of going to middlemen. Local cooperatives become stronger because they have digital proof of their harvests to get bigger, better deals.',
              'Fairer Food Prices: Connecting farms directly to city stores and restaurants removes extra fees. This helps keep food prices stable and affordable for families in the city.',
              'Less Food Waste: A live map showing what is being grown helps the government and big buyers plan better. This ensures food gets to where it is needed before it rots.',
            ].map((item, i) => (
              <li key={i} className={sectionCardClass}>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Existing Solutions */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
            Existing Solutions / Alternatives
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-card shadow-sm">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-foreground">Solution Type</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Examples</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Gap Filled by PresyoAni</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium text-foreground">Marketplaces</td>
                  <td className="px-4 py-3">Mayani</td>
                  <td className="px-4 py-3">These are Online-First. They fail in dead zones where PresyoAni thrives using asynchronous data sync.</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium text-foreground">Diagnostics</td>
                  <td className="px-4 py-3">Plantix</td>
                  <td className="px-4 py-3">Focus on saving the crop (pre-harvest), not valuing the post-harvest. PresyoAni adds grading and logistics.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Traditionalist</td>
                  <td className="px-4 py-3">Middlemen (Comprador)</td>
                  <td className="px-4 py-3">Exploits information asymmetry. PresyoAni reverses this by providing benchmark prices and building digital credit profiles.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* What Makes This Different */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Shield className="h-5 w-5 text-primary" aria-hidden />
            What Makes This Solution Different
          </h2>
          <div className={sectionCardClass}>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              PresyoAni is not just another marketplace; it is a resilient data infrastructure designed specially for the realities of rural agriculture. While others focus on bringing farmers online, we empower farmers offline, and this is why PresyoAni stands out:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              {[
                'Offline-First AI: Unlike cloud-reliant competitors, our Edge AI grades crops and logs data directly on the phone in total signal dead zones, ensuring functionality in remote areas.',
                'Reverses Information Asymmetry: Empowers farmers with real-time city wholesale prices via cached data, eliminating reliance on intermediaries and preventing exploitative distress sales.',
                'Asynchronous "Handshake": Bridges the gap between app-based buyers and offline farmers via automated SMS for direct sales, requiring only basic cellular connectivity.',
                'Zero-Cost for Producers: The platform is free for farmers, monetized through B2B (Business-to-Business) data insights sold to institutional buyers and government agencies tracking food security.',
                'Builds Digital Credit Profiles: By generating objective, digital records of historical harvests, PresyoAni helps farmers build the necessary data profile to access formal bank loans and insurance.',
                'Offline-Ready Verification: The AI grading provides timestamped, verifiable proof of quality at the point of harvest, eliminating disputes over produce grade upon delivery.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Technologies Used */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Smartphone className="h-5 w-5 text-primary" aria-hidden />
            Technologies Used
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              PresyoAni is built as an offline-first Progressive Web App (PWA) complemented by edge AI on-device and lightweight cloud services. The MVP emphasizes reliability in low-connectivity environments, rapid field-grade image analysis, and secure offline-to-online data synchronization.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-card shadow-sm">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 font-semibold text-foreground">Component</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Technology</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Purpose</th>
                    <th className="px-4 py-3 font-semibold text-foreground">MVP Implementation (12 Days)</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    { component: 'PWA App Shell', tech: 'React + Vite', purpose: 'Offline-First App Core', mvp: 'UI shell with offline assets and manifest configuration.' },
                    { component: 'Edge AI (On-Device)', tech: 'TensorFlow.js (Lightweight / Heuristic)', purpose: 'Instant Crop Grading', mvp: 'On-device image analysis using a lightweight model or CV heuristics; no data sent off-device.' },
                    { component: 'Local Memory', tech: 'IndexedDB (Dexie.js)', purpose: 'Offline Storage', mvp: 'Stores harvest photos, timestamps, and GPS locally; works in Airplane Mode.' },
                    { component: 'Sync Engine (Foreground)', tech: 'Network API + App Listener', purpose: 'Data Sync', mvp: 'Syncs unsent records when the app reconnects; manual sync option included.' },
                    { component: 'Price Scraper (Simulated)', tech: 'Python (Scrapy / Playwright)', purpose: 'Market Prices Alerts', mvp: 'Simulated using curated CSV/dataset; daily automated scraping deferred post-MVP.' },
                    { component: 'Buyer Visibility Dashboard', tech: 'Next.js + Tailwind', purpose: 'Supply Overview', mvp: 'Read-only dashboard showing simulated harvest availability by location and crop.' },
                    { component: 'Farmer–Buyer Handshake', tech: 'Twilio SMS API', purpose: 'Two-Way SMS', mvp: 'Sends SMS to farmers on buyer interest; captures and logs free-text replies.' },
                    { component: 'Cloud Backend (Lightweight)', tech: 'Firebase / Supabase', purpose: 'Data Relay', mvp: 'Database schema to store synced harvest records and buyer profiles.' },
                  ].map((row) => (
                    <tr key={row.component} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{row.component}</td>
                      <td className="px-4 py-3">{row.tech}</td>
                      <td className="px-4 py-3">{row.purpose}</td>
                      <td className="px-4 py-3">{row.mvp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={sectionCardClass}>
              <h3 className="mb-2 font-medium text-foreground">Media / Screens</h3>
              <p className="text-muted-foreground">
                Field Screen, Audit Screen, Insight Screen, Buyer Heatmap Screen, Alerts/Notification Screen, Website View.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">Ready to explore the buyer dashboard?</h2>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Go to Dashboard
          </Link>
        </section>
      </main>
    </div>
  )
}
