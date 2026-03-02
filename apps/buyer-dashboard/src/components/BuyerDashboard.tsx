'use client'

import { useState } from 'react'
import {
  MapPin,
  Search,
  Phone,
  Leaf,
  Users,
  Loader2, // Added for loading state
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HarvestMap } from './HarvestMap'

// Added farmers_psid to hardcoded data so the "Place Order" connection works
const harvests = [
  {
    id: 1,
    crop: 'Tomato',
    grade: 'A',
    location: 'Pangasinan',
    volume: '500kg',
    farmer: 'Juan D.',
    verified: true,
    distance: '45km',
    farmers_psid: '25046530591690342', // Replace with your test PSID
  },
  {
    id: 2,
    crop: 'Rice',
    grade: 'A',
    location: 'Nueva Ecija',
    volume: '2,000kg',
    farmer: 'Maria S.',
    verified: true,
    distance: '120km',
    farmers_psid: '25046530591690342',
  },
  {
    id: 3,
    crop: 'Corn',
    grade: 'B',
    location: 'Tarlac',
    volume: '800kg',
    farmer: 'Pedro R.',
    verified: false,
    distance: '90km',
    farmers_psid: '25046530591690342',
  },
  {
    id: 4,
    crop: 'Eggplant',
    grade: 'A',
    location: 'Bulacan',
    volume: '300kg',
    farmer: 'Ana L.',
    verified: true,
    distance: '30km',
    farmers_psid: '25046530591690342',
  },
  {
    id: 5,
    crop: 'Onion',
    grade: 'A',
    location: 'Nueva Ecija',
    volume: '1,500kg',
    farmer: 'Carlos M.',
    verified: true,
    distance: '115km',
    farmers_psid: '25046530591690342',
  },
]

export function BuyerDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [loadingId, setLoadingId] = useState<number | null>(null) // State to show which button is loading
  
  const filters = ['All', 'Tomato', 'Rice', 'Corn', 'Eggplant', 'Onion']

  const filtered =
    selectedFilter === 'All'
      ? harvests
      : harvests.filter((h) => h.crop === selectedFilter)

  /**
   * Updated handleConnect:
   * 1. Keeps the ManyChat redirect logic.
   * 2. Adds the fetch call to Render to notify the farmer.
   */
  const handleConnect = async (harvest: typeof harvests[0]) => {
    setLoadingId(harvest.id);

    // --- Part 1: Notify Farmer via FastAPI (The "Place Order" Connection) ---
    try {
      const response = await fetch("https://presyoani.onrender.com/notify-farmer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmer_psid: harvest.farmers_psid,
          commodity: harvest.crop,
          weight: harvest.volume.replace('kg', ''), // sending just the number
        }),
      });

      if (response.ok) {
        alert(`Order Placed! Farmer notified about the ${harvest.crop}.`);
      }
    } catch (error) {
      console.error("Failed to notify farmer:", error);
    }

    // --- Part 2: Original Redirect Logic ---
    const productInfo = encodeURIComponent(`${harvest.crop} (${harvest.volume})`);
    const manyChatUrl = `https://m.me/938478252689737?ref=w50968964--${productInfo}`;
    window.open(manyChatUrl, '_blank');
    
    setLoadingId(null);
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ESG Impact Banner */}
      <Card className="border-0 bg-primary">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
            <Users className="h-7 w-7 text-secondary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-primary-foreground/80">
              Your Impact
            </p>
            <p className="text-xl font-bold text-primary-foreground">
              24 Farmers Supported
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
          <HarvestMap />
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
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                selectedFilter === f
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
            {filtered.length} results
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {filtered.map((harvest) => (
            <Card
              key={harvest.id}
              className="border border-border/60 transition-all hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      harvest.grade === 'A'
                        ? 'bg-primary/10'
                        : 'bg-secondary/15'
                    }`}
                  >
                    <Leaf
                      className={`h-6 w-6 ${
                        harvest.grade === 'A'
                          ? 'text-primary'
                          : 'text-secondary-foreground'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-foreground">
                        {harvest.crop}
                      </span>
                      <Badge
                        variant={
                          harvest.grade === 'A' ? 'default' : 'secondary'
                        }
                        className="text-xs px-2 py-0"
                      >
                        Grade {harvest.grade}
                      </Badge>
                      {harvest.verified && (
                        <Badge
                          variant="outline"
                          className="border-green-300 text-green-700 text-xs px-2 py-0"
                        >
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {harvest.location}
                      </span>
                      <span>{harvest.volume}</span>
                      <span>{harvest.distance}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="h-10 gap-2 bg-primary text-primary-foreground shrink-0"
                    disabled={loadingId === harvest.id}
                    onClick={() => handleConnect(harvest)}
                  >
                    {loadingId === harvest.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}