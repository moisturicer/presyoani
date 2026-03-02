'use client'

import React, { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { Spinner } from '@/components/ui/spinner'

const CEBU_CENTER: [number, number] = [10.3157, 123.8854]

export type HarvestMapPoint = {
  id: number | string
  lat: number
  lng: number
  weightKg?: number
  label?: string
}

export function HarvestMap({
  points = [],
  loading = false,
}: {
  points?: HarvestMapPoint[]
  loading?: boolean
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const layerRef = useRef<any>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || typeof window === 'undefined') return

    async function initMap() {
      const L = (await import('leaflet')).default
      leafletRef.current = L

      try {
        const map = L.map(mapContainerRef.current!, {
          center: CEBU_CENTER,
          zoom: 9,
          zoomControl: true,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map)

        const layer = L.layerGroup().addTo(map)
        layerRef.current = layer

        mapRef.current = map
      } catch (error: any) {
        if (
          typeof error?.message === 'string' &&
          error.message.includes('Map container is already initialized')
        ) {
          return
        }
        throw error
      }
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      layerRef.current = null
      leafletRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const L = leafletRef.current
    const layer = layerRef.current
    if (!map || !L || !layer) return

    layer.clearLayers()

    if (!points.length) {
      return
    }

    points.forEach((p) => {
      const radius = Math.max(1500, Math.min(7000, (p.weightKg ?? 100) * 20))
      const circle = L.circle([p.lat, p.lng], {
        radius,
        color: '#22c55e',
        weight: 1,
        fillColor: '#22c55e',
        fillOpacity: 0.38,
      })
      if (p.label) {
        circle.bindPopup(p.label)
      }
      circle.addTo(layer)
    })
  }, [points])

  return (
    <div className="relative h-64 w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-[2px]"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" className="border-primary-foreground/60 border-t-transparent" />
            <span className="text-xs font-medium text-muted-foreground">
              Loading harvests…
            </span>
          </div>
        </div>
      )}
    </div>
  )
}