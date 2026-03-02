import { supabase } from '@/lib/supabaseClient'

// Updated to match the new market_listings + farmers schema
export type MarketListingRow = {
  id: number
  commodity: string
  grade: string
  weight: number
  price: number
  farmers_psid: string
  status: boolean
}

export type FarmerRow = {
  farmer_psid: string
  messenger_id: string | null
  location_lng: string | null
  quality_rating: string | null
  location_lat: string | null
}

export type CombinedListing = {
  id: number
  commodity: string
  grade: string | null
  weightKg: number
  price: number | null
  farmerId: string | null
  farmerLabel: string
  rating: number
  lat: number | null
  lng: number | null
}

export async function fetchListingsWithFarmers(): Promise<CombinedListing[]> {
  const [listingsRes, farmersRes] = await Promise.all([
    supabase
      .from('market_listings')
      .select('id, commodity, grade, weight, price, farmers_psid, status')
      .order('id', { ascending: true }),
    supabase
      .from('farmers')
      .select('farmer_psid, messenger_id, location_lng, quality_rating, location_lat'),
  ])

  const { data: listings, error: listingsError } = listingsRes
  const { data: farmers, error: farmersError } = farmersRes

  // Debug: log raw responses
  console.log('[fetchListingsWithFarmers] Raw listings:', listings)
  console.log('[fetchListingsWithFarmers] Raw farmers:', farmers)
  console.log('[fetchListingsWithFarmers] Listings error:', listingsError)
  console.log('[fetchListingsWithFarmers] Farmers error:', farmersError)

  if (listingsError || farmersError) {
    console.error('Supabase error loading listings/farmers', {
      listingsMessage: listingsError?.message,
      listingsCode: listingsError?.code,
      farmersMessage: farmersError?.message,
      farmersCode: farmersError?.code,
    })
    return []
  }

  const safeListings: MarketListingRow[] = (listings ?? []) as MarketListingRow[]
  const safeFarmers: FarmerRow[] = (farmers ?? []) as FarmerRow[]

  // Filter out listings with status=false (include null/undefined as active)
  const activeListings = safeListings.filter((row) => row.status !== false)

  console.log('[fetchListingsWithFarmers] Active listings count:', activeListings.length)
  console.log('[fetchListingsWithFarmers] Farmers count:', safeFarmers.length)

  if (!activeListings.length) {
    return []
  }

  const farmerByPsid = new Map<string, FarmerRow>()
  for (const f of safeFarmers) {
    const psid = (f as any).farmer_psid
    if (psid) {
      farmerByPsid.set(String(psid).toLowerCase(), f)
    }
  }
  console.log('[fetchListingsWithFarmers] Farmer lookup keys:', Array.from(farmerByPsid.keys()))

  const combined = activeListings.map((row, index) => {
    const psidKey = String(row.farmers_psid ?? '').toLowerCase()
    const farmer = farmerByPsid.get(psidKey) ?? farmerByPsid.get(row.farmers_psid) ?? null

    const ratingRaw = farmer?.quality_rating
    const latRaw = farmer?.location_lat
    const lngRaw = farmer?.location_lng

    const rating = ratingRaw === null || ratingRaw === undefined ? 0 : Number(ratingRaw)
    const lat = latRaw === null || latRaw === undefined ? null : Number(latRaw)
    const lng = lngRaw === null || lngRaw === undefined ? null : Number(lngRaw)

    const label =
      farmer?.messenger_id?.replace(/^farmer_messenger_/, 'Farmer ') ??
      `Farmer ${index + 1}`

    return {
      id: row.id,
      commodity: row.commodity,
      grade: row.grade,
      weightKg: row.weight,
      price: row.price,
      farmerId: (farmer as any)?.farmer_psid ?? null,
      farmerLabel: label,
      rating: Number.isNaN(rating) ? 0 : rating,
      lat: Number.isNaN(lat as number) ? null : lat,
      lng: Number.isNaN(lng as number) ? null : lng,
    }
  })

  console.log('[fetchListingsWithFarmers] Combined listings:', combined)
  return combined
}


