'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Cloud,
} from 'lucide-react'

// Simulated trend data (9 days)
const trendValues = [32, 34, 36, 35, 38, 40, 42, 43, 45]
const maxTrend = Math.max(...trendValues)

const otherCrops = [
  { name: 'Rice', price: 52, change: 2, up: true },
  { name: 'Corn', price: 28, change: 1, up: true },
  { name: 'Eggplant', price: 38, change: 4, up: true },
  { name: 'Onion', price: 85, change: 3, up: false },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Market prices and insights
        </p>
      </header>

      <div className="flex flex-col gap-6 p-6">
        {/* Market Price Alert */}
        <Card className="overflow-hidden border-2 border-secondary/70 bg-card">
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
        <Card className="overflow-hidden border border-border bg-rose-50/80 dark:bg-rose-950/20">
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
          <div className="grid grid-cols-2 gap-3">
            {otherCrops.map((crop) => (
              <Card
                key={crop.name}
                className="border border-border bg-card transition-shadow hover:shadow-md"
              >
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
        <Card className="overflow-hidden border border-border">
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
      </div>
    </div>
  )
}
