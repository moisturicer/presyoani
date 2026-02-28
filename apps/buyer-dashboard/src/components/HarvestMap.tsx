'use client'

import { useEffect, useRef } from 'react'

const CEBU_CENTER: [number, number] = [10.3157, 123.8854]

export function HarvestMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    async function initMap() {
      const L = (await import('leaflet')).default

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

        const examplePoints: [number, number][] = [
          [10.3157, 123.8854],
          [10.2926, 123.9416],
          [10.2447, 123.8494],
        ]

        examplePoints.forEach((latlng) => {
          L.circle(latlng, {
            radius: 3000,
            color: '#22c55e',
            weight: 1,
            fillColor: '#22c55e',
            fillOpacity: 0.4,
          }).addTo(map)
        })

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
    }
  }, [])

  return <div ref={mapContainerRef} className="h-64 w-full" />
}