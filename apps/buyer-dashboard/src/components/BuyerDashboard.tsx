'use client'

import { useState } from 'react'
import {
  MapPin,
  Search,
  Phone,
  Leaf,
  Users,
  Award,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

const mapPins = [
  { x: 25, y: 30, grade: 'A', crop: 'Tomato', size: 'lg' },
  { x: 55, y: 20, grade: 'A', crop: 'Rice', size: 'xl' },
  { x: 40, y: 50, grade: 'B', crop: 'Corn', size: 'md' },
  { x: 20, y: 65, grade: 'A', crop: 'Eggplant', size: 'sm' },
  { x: 60, y: 45, grade: 'A', crop: 'Onion', size: 'lg' },
  { x: 75, y: 35, grade: 'B', crop: 'Rice', size: 'md' },
  { x: 35, y: 75, grade: 'A', crop: 'Tomato', size: 'sm' },
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
              Your Impact (SDG 8)
            </p>
            <p className="text-xl font-bold text-primary-foreground">
              24 Farmers Supported
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Award className="h-6 w-6 text-secondary" />
            <span className="mt-1 text-sm font-bold text-secondary">
              480 pts
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap / Map View */}
      <Card className="overflow-hidden border border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
          <CardTitle className="text-base font-bold">
            Live Harvest Heatmap
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Central Luzon
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-64 bg-primary/5 overflow-hidden">
            {/* Simulated map background */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute h-px w-full bg-primary/5"
                  style={{ top: `${(i + 1) * 12}%` }}
                />
              ))}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute w-px h-full bg-primary/5"
                  style={{ left: `${(i + 1) * 12}%` }}
                />
              ))}
            </div>

            {/* Map pins */}
            {mapPins.map((pin, i) => {
              const sizeMap = { sm: 24, md: 32, lg: 40, xl: 48 }
              const s = sizeMap[pin.size as keyof typeof sizeMap]
              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className="absolute rounded-full bg-primary/15"
                    style={{ width: s * 2, height: s * 2 }}
                  />
                  <div
                    className={`relative z-10 flex items-center justify-center rounded-full border-2 ${
                      pin.grade === 'A'
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-secondary bg-secondary text-secondary-foreground'
                    }`}
                    style={{ width: s * 0.7, height: s * 0.7 }}
                  >
                    <Leaf
                      className="h-3 w-3"
                      style={{
                        width: s * 0.3,
                        height: s * 0.3,
                      }}
                    />
                  </div>
                </div>
              )
            })}

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 flex gap-3 rounded-lg bg-card/90 p-2.5 backdrop-blur-sm border border-border">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-xs font-medium text-foreground">Grade A</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-secondary" />
                <span className="text-xs font-medium text-foreground">Grade B</span>
              </div>
            </div>
          </div>
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
