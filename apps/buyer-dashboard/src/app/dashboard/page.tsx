import { BuyerDashboard } from '@/components/BuyerDashboard'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 pb-8 pt-6">
        <header className="flex flex-col gap-3 rounded-2xl bg-card/80 px-5 py-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Buyer dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live harvest availability • Cebu
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary ring-1 ring-primary/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live data demo
            </span>
          </div>
        </header>

        <section className="rounded-2xl bg-card/70 p-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl">
          <BuyerDashboard />
        </section>
      </div>
    </main>
  )
}
