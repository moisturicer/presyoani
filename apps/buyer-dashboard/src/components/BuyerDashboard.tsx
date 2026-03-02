'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { MapPin, Search, Phone, Leaf, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HarvestMap } from './HarvestMap'

// --- 1. SUPABASE SETUP ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- 2. BACKEND URL (Your Render URL) ---
const RENDER_BACKEND_URL = "https://your-app-name.onrender.com" 

export function BuyerDashboard() {
  const [harvests, setHarvests] = useState<any[]>([])
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  // --- 3. FETCH LIVE DATA FROM SUPABASE ---
  useEffect(() => {
    async function fetchHarvests() {
      setLoading(true)
      const { data, error } = await supabase
        .from('market_listings')
        .select('*')
        .eq('status', true) 
        .order('created_at', { ascending: false })

      if (!error && data) {
        setHarvests(data)
      }
      setLoading(false)
    }
    fetchHarvests()
  }, [])

  const filters = ['All', 'Tomato', 'Chili', 'Sweet Potato']

  const filtered = selectedFilter === 'All'
    ? harvests
    : harvests.filter((h) => h.commodity.toLowerCase().includes(selectedFilter.toLowerCase()))

  // --- 4. NOTIFY FARMER VIA FASTAPI ---
  const handleConnect = async (harvest: any) => {
    try {
      // Send request to your FastAPI backend on Render
      const response = await fetch(`${RENDER_BACKEND_URL}/notify-farmer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_psid: harvest.farmers_psid,
          commodity: harvest.commodity,
          weight: harvest.weight
        })
      });

      if (response.ok) {
        alert(`Notification sent to farmer for ${harvest.commodity}! Check Messenger.`);
      } else {
        alert("Failed to send notification.");
      }
    } catch (err) {
      console.error("Error notifying farmer:", err);
      alert("Error connecting to server.");
    }
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
            <p className="text-sm font-medium text-white/80">Your Impact</p>
            <p className="text-xl font-bold text-white">
              {harvests.length + 24} Farmers Supported
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap View */}
      <Card className="overflow-hidden border border-border">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
          <CardTitle className="text-base font-bold text-black">Live Harvest Heatmap</CardTitle>
          <Badge variant="outline" className="text-xs">Cebu</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <HarvestMap />
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 text-black">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search crops..." className="h-11 pl-10 text-sm bg-card text-black" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                selectedFilter === f ? 'bg-primary text-white' : 'bg-muted text-black'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Active Harvests List */}
      <div className="text-black">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold">Active Harvests</h3>
          <span className="text-sm text-muted-foreground">{filtered.length} results</span>
        </div>

        {loading ? (
          <p className="text-center py-10">Searching the market...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((harvest) => (
              <Card key={harvest.id} className="border border-border/60 transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold capitalize text-black">{harvest.commodity}</span>
                        <Badge variant="secondary" className="text-xs">Grade {harvest.grade}</Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Cebu</span>
                        <span>{harvest.weight}kg</span>
                        <span className="font-bold text-green-700">₱{harvest.price}/kg</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="h-10 gap-2 bg-primary text-white"
                      onClick={() => handleConnect(harvest)}
                    >
                      <Phone className="h-4 w-4" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}