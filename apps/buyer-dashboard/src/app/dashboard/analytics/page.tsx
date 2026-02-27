'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BarChart3, TrendingUp, TrendingDown, Cloud } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type CropSeriesPoint = {
  date: string
  price: number
}

type CropAnalytics = {
  id: string
  label: string
  latestPrice: number | null
  changeFromPrev: number | null
  up: boolean | null
  series: CropSeriesPoint[]
}

type AnalyticsResponse = {
  crops: CropAnalytics[]
  defaultCropId: string
  latestDate: string | null
}

export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  const router = useRouter()

  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/dpi-analytics')
        if (!res.ok) return
        const data: AnalyticsResponse = await res.json()
        if (!isMounted) return
        setAnalytics(data)
        if (!selectedCropId) {
          setSelectedCropId(data.defaultCropId ?? data.crops[0]?.id ?? null)
        }
      } catch {
        // If this fails, we fall back to placeholder UI
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchAnalytics()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let isMounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return

      if (!data.user) {
        router.replace('/login')
      }
    })

    return () => {
      isMounted = false
    }
  }, [router])

  const selectedCrop =
    analytics?.crops.find((crop) => crop.id === selectedCropId) ??
    analytics?.crops[0] ??
    null

  const trendValues =
    selectedCrop?.series.map((p) => p.price) ?? Array(10).fill(0)

  const maxTrend =
    trendValues.length > 0 ? Math.max(...trendValues, 0) || 1 : 1

  const filteredOtherCrops =
    analytics?.crops
      .filter((crop) => crop.id !== selectedCrop?.id)
      .filter(
        (crop) => crop.series.filter((point) => point.price > 0).length > 1,
      )
      .filter((crop) =>
        crop.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ?? []

  const sortedOtherCrops = [...filteredOtherCrops].sort((a, b) => {
    const getGroupPriority = (crop: CropAnalytics) => {
      if (crop.changeFromPrev == null) return 1
      if (crop.up === false) return 0 // most decrease first
      if (crop.up === null) return 1 // neutral
      if (crop.up === true) return 2 // increases last
      return 1
    }

    const groupA = getGroupPriority(a)
    const groupB = getGroupPriority(b)
    if (groupA !== groupB) return groupA - groupB

    const magA =
      a.changeFromPrev != null ? Math.abs(a.changeFromPrev) : 0
    const magB =
      b.changeFromPrev != null ? Math.abs(b.changeFromPrev) : 0

    if (magA !== magB) return magB - magA

    return a.label.localeCompare(b.label)
  })

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
          <div className="flex flex-col items-start gap-1 text-xs sm:text-sm sm:items-end">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 font-medium text-secondary-foreground ring-1 ring-secondary/30">
              <Cloud className="h-3.5 w-3.5" />
              Synced to latest harvests
            </span>
            {analytics?.latestDate && (
              <span className="text-[11px] text-muted-foreground">
                Latest: {new Date(analytics.latestDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
              </span>
            )}
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
                {selectedCrop
                  ? `${selectedCrop.label} – City market price`
                  : 'Loading crop prices...'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {selectedCrop?.latestPrice != null ? (
                    <>
                      P{selectedCrop.latestPrice.toFixed(2)}
                      <span className="text-lg font-medium text-muted-foreground">
                        /kg
                      </span>
                    </>
                  ) : (
                    <>
                      P--
                      <span className="text-lg font-medium text-muted-foreground">
                        /kg
                      </span>
                    </>
                  )}
                </span>
                {selectedCrop && selectedCrop.changeFromPrev != null ? (
                  <span
                    className={`flex items-center gap-1 text-sm font-medium ${
                      selectedCrop.up === true
                        ? 'text-green-600'
                        : selectedCrop.up === false
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {selectedCrop.up === true && (
                      <TrendingUp className="h-4 w-4" />
                    )}
                    {selectedCrop.up === false && (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {selectedCrop.up === true ? '+' : ''}
                    P{Math.abs(selectedCrop.changeFromPrev).toFixed(2)} from
                    yesterday
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    Change data not available
                  </span>
                )}
              </div>
              <div className="flex items-end gap-1.5 pt-2" style={{ height: 120 }}>
                {trendValues.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/60 transition-all hover:bg-primary/80"
                    style={{
                      height: `${(val / maxTrend) * 100}%`,
                      minHeight: 8,
                    }}
                    title={`Day ${i + 1}: P${val.toFixed(2)}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Last 10 days</p>
            </CardContent>
          </Card>

          {/* Other Crop Prices */}
          <div>
            <h3 className="mb-3 text-base font-bold text-foreground">
              Other Crop Prices
            </h3>
            <div className="mb-3">
              <Input
                placeholder="Search crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 max-w-xs text-xs"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sortedOtherCrops.map((crop) => {
                  const change =
                    crop.changeFromPrev != null
                      ? Number(crop.changeFromPrev.toFixed(2))
                      : null

                  const isUp = crop.up === true
                  const isDown = crop.up === false

                  return (
                    <Card
                      key={crop.id}
                      className="border border-border bg-card/95 transition-shadow hover:shadow-md cursor-pointer"
                      onClick={() => setSelectedCropId(crop.id)}
                    >
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">
                          {crop.label}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xl font-bold text-foreground">
                            {crop.latestPrice != null
                              ? `P${crop.latestPrice.toFixed(2)}`
                              : 'P--'}
                          </span>
                          {change != null ? (
                            <span
                              className={`flex items-center gap-0.5 text-sm font-medium ${
                                isUp
                                  ? 'text-green-600'
                                  : isDown
                                    ? 'text-destructive'
                                    : 'text-muted-foreground'
                              }`}
                            >
                              {isUp && <TrendingUp className="h-4 w-4" />}
                              {isDown && <TrendingDown className="h-4 w-4" />}
                              {isUp ? '+' : isDown ? '' : ''}
                              {Math.abs(change).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No previous data
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              {analytics &&
                !loading &&
                sortedOtherCrops.length === 0 && (
                  <p className="col-span-full text-xs text-muted-foreground">
                    No crops match your search.
                  </p>
                )}
              {loading && !analytics && (
                <p className="text-sm text-muted-foreground">
                  Loading crop prices...
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
