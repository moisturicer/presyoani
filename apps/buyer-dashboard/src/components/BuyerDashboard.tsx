'use client'

import { useEffect, useMemo, useState } from 'react'
import { MapPin, Search, Leaf, Users, ShoppingCart, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useCart } from '@/components/cart/CartContext'
import dynamic from 'next/dynamic'
import { fetchListingsWithFarmers, type CombinedListing } from '@/service/marketListingsService'
import type { HarvestMapPoint } from './HarvestMap'

const HarvestMap = dynamic(
  () => import('./HarvestMap').then((mod) => mod.HarvestMap),
  { ssr: false },
)

export function BuyerDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [listings, setListings] = useState<CombinedListing[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { addItem, items: cartItems } = useCart()

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    fetchListingsWithFarmers()
      .then((rows) => {
        console.log('[BuyerDashboard] Fetched listings:', rows)
        if (!cancelled) {
          setListings(rows)
        }
      })
      .catch((err) => {
        console.error('Failed to load listings', err)
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filters = useMemo(() => {
    const names = Array.from(new Set(listings.map((l) => l.commodity))).sort()
    return ['All', ...names]
  }, [listings])

  const filtered = useMemo(
    () =>
      selectedFilter === 'All'
        ? listings
        : listings.filter((h) => h.commodity === selectedFilter),
    [listings, selectedFilter],
  )

  const farmerCount = useMemo(() => {
    const ids = new Set(listings.map((l) => l.farmerId).filter(Boolean))
    return ids.size || listings.length
  }, [listings])

  const handleAddToCart = (harvest: CombinedListing) => {
    addItem({
      id: harvest.id,
      commodity: harvest.commodity,
      grade: harvest.grade,
      weightKg: harvest.weightKg,
      price: harvest.price,
      farmer: harvest.farmerLabel,
      rating: harvest.rating,
    })
  }

  const mapPoints: HarvestMapPoint[] = useMemo(
    () =>
      listings
        .filter((l) => l.lat !== null && l.lng !== null)
        .map((l) => ({
          id: l.id,
          lat: l.lat as number,
          lng: l.lng as number,
          weightKg: l.weightKg,
          label: `${l.commodity} • ${l.weightKg}kg • ${l.farmerLabel}`,
        })),
    [listings],
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Impact banner */}
      <Card className="border-0 bg-primary">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
            {isLoading ? (
              <Spinner size="md" className="border-primary-foreground border-t-transparent" />
            ) : (
              <Users className="h-7 w-7 text-secondary-foreground" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-primary-foreground/80">
              Live from the field
            </p>
            <p className="text-xl font-bold text-primary-foreground">
              {isLoading
                ? 'Loading farmers & listings…'
                : `${farmerCount} farmers currently listed`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap / Map View */}
      <Card className="overflow-hidden border border-border">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
          <CardTitle className="text-base font-bold">
            Live Harvest Heatmap
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Cebu
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <HarvestMap points={mapPoints} loading={isLoading} />
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search crops, locations..."
            className="h-11 pl-10 text-sm bg-card"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${selectedFilter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Active Harvests List */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            Active Harvests
          </h3>
          <span className="text-sm text-muted-foreground">
            {isLoading ? 'Loading…' : `${filtered.length} results`}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="border border-border/60 animate-pulse"
                  aria-hidden="true"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 shrink-0 rounded-xl bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-24 rounded bg-muted" />
                        <div className="flex gap-2">
                          <div className="h-5 w-16 rounded bg-muted" />
                          <div className="h-5 w-20 rounded bg-muted" />
                        </div>
                        <div className="flex gap-4">
                          <div className="h-4 w-32 rounded bg-muted" />
                          <div className="h-4 w-12 rounded bg-muted" />
                          <div className="h-4 w-24 rounded bg-muted" />
                        </div>
                      </div>
                      <div className="h-10 w-24 shrink-0 rounded-md bg-muted" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <Card className="border border-border/60">
              <CardContent className="p-6 text-sm text-muted-foreground">
                No active market listings found.
              </CardContent>
            </Card>
          )}
          {!isLoading && filtered.map((harvest) => (
            <Card
              key={harvest.id}
              className="border border-border/60 transition-all hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${harvest.grade === 'A'
                        ? 'bg-primary/10'
                        : 'bg-secondary/15'
                      }`}
                  >
                    <Leaf
                      className={`h-6 w-6 ${harvest.grade === 'A'
                          ? 'text-primary'
                          : 'text-secondary-foreground'
                        }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-foreground">
                        {harvest.commodity}
                      </span>
                      {harvest.grade && (
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          Grade {harvest.grade}
                        </Badge>
                      )}
                      {harvest.price !== null && (
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          ₱{harvest.price.toFixed(0)}/kg
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {harvest.lat !== null && harvest.lng !== null
                          ? `${harvest.lat.toFixed(2)}, ${harvest.lng.toFixed(2)}`
                          : 'Cebu'}
                      </span>
                      <span>{harvest.weightKg}kg</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {harvest.rating.toFixed(2)}
                      </span>
                      <span>{harvest.farmerLabel}</span>
                    </div>
                  </div>
                  {(() => {
                    const inCart = cartItems.some((item) => item.id === harvest.id)
                    return (
                      <Button
                        variant={inCart ? 'outline' : 'outline'}
                        size="sm"
                        className="h-10 gap-2 shrink-0"
                        onClick={() => handleAddToCart(harvest)}
                        disabled={isLoading}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {inCart ? 'Already in cart' : 'Add to cart'}
                      </Button>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
