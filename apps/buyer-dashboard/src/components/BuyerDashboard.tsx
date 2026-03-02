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

/**
 * 1. Added 'export' here. 
 * This prevents the Vercel error because exported functions are considered "used".
 */
export const handlePlaceOrder = async (itemsInCart: any[]) => {
  const BACKEND_URL = "https://presyoani.onrender.com/notify-farmer";

  for (const item of itemsInCart) {
    try {
      // Logic to trigger your Python bot
      await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_psid: item.farmers_psid, 
          commodity: item.commodity,
          weight: item.weightKg || item.weight
        })
      });
      console.log(`Notification sent for ${item.commodity}`);
    } catch (err) {
      console.error("Failed to notify farmer:", err);
    }
  }
  alert("Order Placed! Farmers have been notified.");
};

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
        if (!cancelled) setListings(rows)
      })
      .catch((err) => console.error('Failed to load listings', err))
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const filters = useMemo(() => {
    const names = Array.from(new Set(listings.map((l) => l.commodity))).sort()
    return ['All', ...names]
  }, [listings])

  const filtered = useMemo(
    () => selectedFilter === 'All' ? listings : listings.filter((h) => h.commodity === selectedFilter),
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
      /**
       * 2. CRITICAL CHANGE:
       * You must include the ID here so that when the item is in the cart,
       * the handlePlaceOrder function knows which farmer to notify.
       */
      farmers_psid: harvest.farmers_psid ?? undefined 
    })
  }

  const mapPoints: HarvestMapPoint[] = useMemo(
    () =>
      listings
        .filter((l) => l.lat !== null && l.lng !== null)
        .map((l) => ({
          id: l.id, lat: l.lat as number, lng: l.lng as number, weightKg: l.weightKg,
          label: `${l.commodity} • ${l.weightKg}kg • ${l.farmerLabel}`,
        })),
    [listings],
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card className="border-0 bg-primary text-white">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
            {isLoading ? <Spinner size="md" /> : <Users className="h-7 w-7 text-secondary-foreground" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium opacity-80">Live from the field</p>
            <p className="text-xl font-bold">{farmerCount} farmers currently listed</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border border-border">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
          <CardTitle className="text-base font-bold text-black">Live Harvest Heatmap</CardTitle>
          <Badge variant="outline">Cebu</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <HarvestMap points={mapPoints} loading={isLoading} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search crops..." className="h-11 pl-10 bg-card text-black" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedFilter === f ? 'bg-primary text-white' : 'bg-muted text-black'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? <p className="text-center text-black">Loading listings...</p> : 
          filtered.map((harvest) => (
            <Card key={harvest.id} className="border border-border/60 transition-all hover:shadow-md">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-xl">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-base font-bold text-black">{harvest.commodity}</span>
                    <div className="mt-1 flex gap-x-4 text-sm text-gray-500">
                      <span>{harvest.weightKg}kg</span>
                      <span>Grade {harvest.grade}</span>
                      <span className="font-bold text-green-700">₱{harvest.price}/kg</span>
                    </div>
                </div>
                {(() => {
                  const inCart = cartItems.some((item) => item.id === harvest.id)
                  return (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 gap-2 border-black text-black"
                      onClick={() => handleAddToCart(harvest)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {inCart ? 'In cart' : 'Add to cart'}
                    </Button>
                  )
                })()}
              </CardContent>
            </Card>
          ))
        }
      </div>
    </div>
  )
}