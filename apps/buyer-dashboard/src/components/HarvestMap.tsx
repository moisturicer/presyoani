'use client'

import { useEffect, useRef } from 'react'

const CEBU_CENTER: [number, number] = [10.3157, 123.8854]

export type HarvestMapPoint = {
  id: number | string
  lat: number
  lng: number
  weightKg?: number
  label?: string
}

export function HarvestMap({ points = [] }: { points?: HarvestMapPoint[] }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const layerRef = useRef<any>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

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

    const effectivePoints =
      points.length > 0
        ? points
        : [
            { id: 1, lat: 10.3157, lng: 123.8854, weightKg: 500, label: 'Cebu City' },
            { id: 2, lat: 10.3236, lng: 123.9223, weightKg: 800, label: 'Mandaue City' },
            { id: 3, lat: 10.2447, lng: 123.8494, weightKg: 300, label: 'Talisay City' },
          ]

    effectivePoints.forEach((p) => {
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

  return <div ref={mapContainerRef} className="h-64 w-full" />
}