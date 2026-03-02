import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import fs from 'fs/promises'
import path from 'path'

type RawRecord = {
  commodity: string
  specification: string | null
  price: number
  date_updated: string
}

type CropConfig = {
  id: string
  label: string
  commodity: string
}

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

// Converts a commodity name into a URL-friendly slug
function slugifyCommodityName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'crop'
}

// Derives a unique list of crop configs from raw records
function createCropConfigs(records: RawRecord[]): CropConfig[] {
  const byCommodity = new Map<string, CropConfig>()

  for (const rec of records) {
    if (!rec.commodity) continue
    if (byCommodity.has(rec.commodity)) continue

    byCommodity.set(rec.commodity, {
      id: slugifyCommodityName(rec.commodity),
      label: rec.commodity,
      commodity: rec.commodity,
    })
  }

  return Array.from(byCommodity.values())
}

/**
 * Builds analytics for each crop including latest price, price change,
 * and a 10-day price series ending on the most recent date in the dataset.
 */
function buildCropAnalytics(
  crops: CropConfig[],
  records: RawRecord[],
): { crops: CropAnalytics[]; defaultCropId: string; latestDate: string | null } {
  if (records.length === 0) {
    return {
      crops: [],
      defaultCropId: crops[0]?.id ?? 'tomato',
      latestDate: null,
    }
  }

  const latestDate = records
    .map((r) => r.date_updated)
    .reduce(
      (max, current) => (current > max ? current : max),
      records[0].date_updated,
    )

  const recordsByCommodity = new Map<string, RawRecord[]>()
  for (const rec of records) {
    const arr = recordsByCommodity.get(rec.commodity) ?? []
    arr.push(rec)
    recordsByCommodity.set(rec.commodity, arr)
  }

  const cropsAnalytics: CropAnalytics[] = crops.map((crop) => {
    const relevant = (recordsByCommodity.get(crop.commodity) ?? []).sort(
      (a, b) => a.date_updated.localeCompare(b.date_updated),
    )

    const latestRecord = relevant[relevant.length - 1]
    const prevRecord = relevant[relevant.length - 2]

    const latestPrice = latestRecord ? latestRecord.price : null

    let changeFromPrev: number | null = null
    let up: boolean | null = null

    if (latestRecord && prevRecord) {
      changeFromPrev = Number(
        (latestRecord.price - prevRecord.price).toFixed(2),
      )
      up = changeFromPrev > 0 ? true : changeFromPrev < 0 ? false : null
    }

    // Build a 10-day price series; days with no data default to 0
    const points: CropSeriesPoint[] = []
    const priceByDate = new Map<string, number>()

    for (const rec of relevant) {
      priceByDate.set(rec.date_updated, rec.price)
    }

    const latestDateObj = new Date(latestDate)

    const windowSize = 10
    for (let offset = windowSize - 1; offset >= 0; offset--) {
      const d = new Date(latestDateObj)
      d.setDate(d.getDate() - offset)
      const iso = d.toISOString().slice(0, 10)
      const price = priceByDate.get(iso) ?? 0
      points.push({ date: iso, price })
    }

    return {
      id: crop.id,
      label: crop.label,
      latestPrice,
      changeFromPrev,
      up,
      series: points,
    }
  })

  return {
    crops: cropsAnalytics,
    defaultCropId: 'tomato',
    latestDate,
  }
}

/**
 * Fetches all rows from dpi_prices using pagination to bypass Supabase's
 * 1000-row default limit. Returns normalized and validated records.
 */
async function fetchAllDpiPrices(): Promise<RawRecord[]> {
  const allData: RawRecord[] = []
  const pageSize = 1000
  let from = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase
      .from('dpi_prices')
      .select('commodity, specification, price, date_updated')
      .order('date_updated', { ascending: false })
      .range(from, from + pageSize - 1)

    if (error || !data) break

    const normalized = data
      .filter(
        (row) =>
          row.commodity &&
          Number.isFinite(Number(row.price)) &&
          /^\d{4}-\d{2}-\d{2}$/.test(row.date_updated),
      )
      .map((row) => ({
        commodity: row.commodity,
        specification: row.specification ?? null,
        price: Number(row.price),
        date_updated: row.date_updated,
      }))

    allData.push(...normalized)
    hasMore = data.length === pageSize
    from += pageSize
  }

  return allData
}

/** GET /api/dpi-analytics — Returns price analytics for all crops. */
export async function GET() {
  const records = await fetchAllDpiPrices()

  console.log('Total rows fetched:', records.length)
  console.log('Dates in data:', [...new Set(records.map(r => r.date_updated))])

  if (records.length === 0) {
    return NextResponse.json<AnalyticsResponse>(
      { crops: [], defaultCropId: 'tomato', latestDate: null },
      { status: 200 },
    )
  }

  const cropsConfig = createCropConfigs(records)
  const payload = buildCropAnalytics(cropsConfig, records)

  return NextResponse.json<AnalyticsResponse>(payload)
}