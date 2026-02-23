"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Cloud,
  Shield,
  ArrowUpRight,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function PriceAlertScreen() {
  const [syncProgress, setSyncProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) return 100
        return prev + Math.random() * 8
      })
    }, 500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Main Price Alert */}
      <Card className="overflow-hidden border-2 border-secondary">
        <div className="bg-primary p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            <span className="text-sm font-bold text-primary-foreground">
              Market Price Alert
            </span>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="flex flex-col items-center gap-1 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tomato - City Market Price
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-foreground">
                {"₱45"}
              </span>
              <span className="text-lg font-medium text-muted-foreground">
                /kg
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                +₱5 from yesterday
              </span>
            </div>
          </div>

          {/* Price History Mini */}
          <div className="flex items-end justify-between gap-1 px-6 pb-4">
            {[28, 32, 30, 35, 33, 38, 40, 42, 45].map((price, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/20"
                  style={{ height: `${(price / 50) * 60}px` }}
                >
                  <div
                    className="w-full rounded-t bg-primary"
                    style={{
                      height: `${(price / 50) * 60}px`,
                      opacity: i === 8 ? 1 : 0.3 + i * 0.07,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-6 pb-4">
            <span className="text-xs text-muted-foreground">9 days ago</span>
            <span className="text-xs font-semibold text-foreground">Today</span>
          </div>
        </CardContent>
      </Card>

      {/* Negotiation Guide */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-800">
                Negotiation Guide
              </p>
              <p className="mt-1 text-xs leading-relaxed text-red-700">
                Based on current market conditions and transport costs:
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-100 p-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-black text-red-800">
                  {"Do not sell for less than ₱35/kg"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <Info className="h-3 w-3" />
                <span>{"Fair range: ₱35 - ₱42/kg at farm gate"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Crop Prices */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">
          Other Crop Prices
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <PriceMiniCard crop="Rice" price={52} change={2} />
          <PriceMiniCard crop="Corn" price={28} change={-1} />
          <PriceMiniCard crop="Eggplant" price={38} change={4} />
          <PriceMiniCard crop="Onion" price={85} change={-3} />
        </div>
      </div>

      {/* Smart Sync Progress */}
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cloud className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-foreground">
              Smart Sync
            </span>
            <Badge
              variant="outline"
              className={`ml-auto text-xs ${
                syncProgress >= 100
                  ? "border-green-500 text-green-600"
                  : "border-secondary text-secondary-foreground"
              }`}
            >
              {syncProgress >= 100 ? "Complete" : "Syncing..."}
            </Badge>
          </div>
          <Progress
            value={Math.min(syncProgress, 100)}
            className="h-3 bg-muted"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>3 harvest records</span>
            <span>{Math.min(Math.round(syncProgress), 100)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PriceMiniCard({
  crop,
  price,
  change,
}: {
  crop: string
  price: number
  change: number
}) {
  const isUp = change > 0
  return (
    <Card className="border border-border/60">
      <CardContent className="flex items-center gap-3 p-3">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground">{crop}</p>
          <p className="text-lg font-black text-foreground">{"₱"}{price}</p>
        </div>
        <div
          className={`flex items-center gap-0.5 text-xs font-bold ${
            isUp ? "text-green-600" : "text-red-500"
          }`}
        >
          {isUp ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {isUp ? "+" : ""}
          {change}
        </div>
      </CardContent>
    </Card>
  )
}
