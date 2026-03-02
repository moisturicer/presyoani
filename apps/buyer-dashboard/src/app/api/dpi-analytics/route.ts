import { NextResponse } from 'next/server'
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

const ROOT_DIR = path.join(process.cwd(), '..', '..')

const LATEST_DPI_PATH = path.join(
  ROOT_DIR,
  'services',
  'dpi_scraper',
  'output',
  'latest_dpi.csv',
)

// We now derive crops dynamically from the CSV contents instead of a fixed list.

async function readFileIfExists(filePath: string): Promise<string | null> {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return content
  } catch {
    return null
  }
}

function splitCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
      continue
    }

    current += char
  }

  result.push(current)
  return result.map((v) => v.trim())
}

function parseLatestDpiCsv(content: string): RawRecord[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length <= 1) return []

  const headerFields = splitCsvLine(lines[0])

  const commodityIdx = headerFields.indexOf('commodity')
  const specificationIdx = headerFields.indexOf('specification')
  const priceIdx = headerFields.indexOf('price')
  const dateIdx = headerFields.indexOf('date_updated')

  if (commodityIdx === -1 || priceIdx === -1 || dateIdx === -1) {
    return []
  }

  const dataLines = lines.slice(1)
  const records: RawRecord[] = []

  for (const line of dataLines) {
    if (!line.trim()) continue

    const fields = splitCsvLine(line)

    const commodity = fields[commodityIdx] ?? ''
    const priceStr = fields[priceIdx]
    const dateStr = fields[dateIdx]
    const specification =
      specificationIdx !== -1 && fields[specificationIdx]
        ? fields[specificationIdx]
        : null

    if (!commodity || priceStr == null || dateStr == null) continue

    const price = Number(priceStr)
    if (!Number.isFinite(price)) continue

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue

    records.push({
      commodity,
      specification,
      price,
      date_updated: dateStr,
    })
  }

  return records
}

function slugifyCommodityName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'crop'
}

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

    // 10-day window ending on the latest date in the latest_dpi.csv
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

export async function GET() {
  const latestContent = await readFileIfExists(LATEST_DPI_PATH)

  if (!latestContent) {
    return NextResponse.json<AnalyticsResponse>(
      { crops: [], defaultCropId: 'tomato', latestDate: null },
      { status: 200 },
    )
  }

  const latestRecords = parseLatestDpiCsv(latestContent)

  const cropsConfig = createCropConfigs(latestRecords)

  const payload = buildCropAnalytics(cropsConfig, latestRecords)

  return NextResponse.json<AnalyticsResponse>(payload)
}

