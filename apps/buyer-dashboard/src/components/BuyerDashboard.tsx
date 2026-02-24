'use client'

import { useState } from 'react'
import {
  MapPin,
  Search,
  Phone,
  Leaf,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HarvestMap } from './HarvestMap'

// Currently hardcoded for UI purposes
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
  },
]

export function BuyerDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const filters = ['All', 'Tomato', 'Rice', 'Corn', 'Eggplant', 'Onion']

  const filtered =
    selectedFilter === 'All'
      ? harvests
      : harvests.filter((h) => h.crop === selectedFilter)

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
            {/* Hardcoded */}
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
                  >
                    <Phone className="h-4 w-4" />
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
