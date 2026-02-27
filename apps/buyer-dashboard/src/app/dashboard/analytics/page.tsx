'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Cloud,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

// Simulated trend data (9 days)
const trendValues = [32, 34, 36, 35, 38, 40, 42, 43, 45]
const maxTrend = Math.max(...trendValues)

export const dynamic = 'force-dynamic'

const otherCrops = [
  { name: 'Rice', price: 52, change: 2, up: true },
  { name: 'Corn', price: 28, change: 1, up: true },
  { name: 'Eggplant', price: 38, change: 4, up: true },
  { name: 'Onion', price: 85, change: 3, up: false },
]

export default function AnalyticsPage() {
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!isMounted) return

        if (!data.user) {
          router.replace('/login')
        }
      })

    return () => {
      isMounted = false
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 pb-8 pt-6">
        <header className="flex flex-col gap-3 rounded-2xl bg-card/80 px-5 py-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Market prices and insights
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 font-medium text-secondary-foreground ring-1 ring-secondary/30">
              <Cloud className="h-3.5 w-3.5" />
              Synced to latest harvests
            </span>
          </div>
        </header>

        <section className="flex flex-col gap-6 rounded-2xl bg-card/70 p-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl">
        {/* Market Price Alert */}
        <Card className="overflow-hidden border border-secondary/60 bg-card/95 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base font-semibold">
                Market Price Alert
              </CardTitle>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tomato – City market price
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                P45 <span className="text-lg font-medium text-muted-foreground">/kg</span>
              </span>
              <span className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                +P5 from yesterday
              </span>
            </div>
            <div className="flex items-end gap-1.5 pt-2" style={{ height: 80 }}>
              {trendValues.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/60 transition-all hover:bg-primary/80"
                  style={{
                    height: `${(val / maxTrend) * 100}%`,
                    minHeight: 8,
                  }}
                  title={`Day ${i + 1}: P${val}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              9 days ago → Today
            </p>
          </CardContent>
        </Card>

        {/* Negotiation Guide */}
        <Card className="overflow-hidden border border-border bg-rose-50/80 shadow-sm dark:bg-rose-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-base font-semibold text-foreground">
                Negotiation Guide
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on current market conditions and transport costs
            </p>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="flex items-center gap-2 font-bold text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Do not sell for less than P35/kg
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              Fair range P35–P42/kg at farm gate
            </p>
          </CardContent>
        </Card>

        {/* Other Crop Prices */}
        <div>
          <h3 className="mb-3 text-base font-bold text-foreground">
            Other Crop Prices
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {otherCrops.map((crop) => (
              <Card key={crop.name} className="border border-border bg-card/95 transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{crop.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xl font-bold text-foreground">
                      P{crop.price}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-sm font-medium ${
                        crop.up ? 'text-blue-600' : 'text-destructive'
                      }`}
                    >
                      {crop.up ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {crop.up ? '+' : '-'}{crop.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Smart Sync */}
        <Card className="overflow-hidden border border-border bg-card/95 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">
                Smart Sync
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              3 harvest records
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: '100%' }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sync progress</span>
              <Badge variant="default" className="bg-primary text-primary-foreground">
                Complete
              </Badge>
            </div>
          </CardContent>
        </Card>
        </section>
      </div>
    </main>
  )
}
