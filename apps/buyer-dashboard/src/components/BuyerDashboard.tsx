'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { MapPin, Search, Phone, Leaf, Users, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HarvestMap } from './HarvestMap'

// --- 1. SUPABASE CONFIG ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- 2. RENDER BACKEND CONFIG ---
const RENDER_BACKEND_URL = "https://presyoani.onrender.com" 

export function BuyerDashboard() {
  const [harvests, setHarvests] = useState<any[]>([])
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [notifyingId, setNotifyingId] = useState<string | null>(null)

  // --- 3. FETCH LIVE DATA FROM SUPABASE ---
  useEffect(() => {
    async function fetchHarvests() {
      setLoading(true)
      const { data, error } = await supabase
        .from('market_listings')
        .select('*')
        .eq('status', true)
        .order('created_at', { ascending: false })

      if (!error && data) setHarvests(data)
      setLoading(false)
    }
    fetchHarvests()
  }, [])

  const filters = ['All', 'Tomato', 'Chili', 'Sweet Potato']

  const filtered = selectedFilter === 'All'
    ? harvests
    : harvests.filter((h) => h.commodity.toLowerCase().includes(selectedFilter.toLowerCase()))

  // --- 4. THE NOTIFICATION LOGIC ---
  const handleBuyNow = async (harvest: any) => {
    setNotifyingId(harvest.id) // Show loading state on button
    try {
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
        alert(`Order placed! We notified the farmer for their ${harvest.weight}kg of ${harvest.commodity}.`);
      } else {
        alert("Failed to notify farmer. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Backend server is not responding.");
    } finally {
      setNotifyingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-white min-h-screen">
      {/* Impact Banner */}
      <Card className="border-0 bg-green-600">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
            <Users className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80">Your Impact</p>
            <p className="text-xl font-bold text-white">{harvests.length + 15} Farmers Supported</p>
          </div>
        </CardContent>
      </Card>

      {/* Map View */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-base font-bold text-gray-900">Live Harvest Heatmap (Cebu)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <HarvestMap />
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                selectedFilter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Active Harvests</h3>
        {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-green-600" /></div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((harvest) => (
              <Card key={harvest.id} className="border border-gray-100 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold capitalize text-gray-900">{harvest.commodity}</span>
                        <Badge className="bg-blue-50 text-blue-700 border-none">Grade {harvest.grade}</Badge>
                      </div>
                      <div className="mt-1 flex gap-x-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Cebu</span>
                        <span>{harvest.weight}kg</span>
                        <span className="font-bold text-green-600">₱{harvest.price}/kg</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={notifyingId === harvest.id}
                      onClick={() => handleBuyNow(harvest)}
                    >
                      {notifyingId === harvest.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4 mr-1" />}
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