import { BuyerDashboard } from '@/components/BuyerDashboard'

export default function DashboardPage() {
  return (
    <div>
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">
          Buyer Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Live harvest availability • Cebu
        </p>
      </header>
      <BuyerDashboard />
    </div>
  )
}
