'use client'

import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – using Leaflet without bundled type declarations
import L from 'leaflet'

const CEBU_CENTER: [number, number] = [10.3157, 123.8854] // Cebu City

export function HarvestMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: CEBU_CENTER,
      zoom: 9,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Example harvest “heat” markers (replace with your live data later)
    const examplePoints: [number, number][] = [
      [10.3157, 123.8854], // Cebu City
      [10.2926, 123.9416], // Mandaue
      [10.2447, 123.8494], // Talisay
    ]

    examplePoints.forEach((latlng) => {
      L.circle(latlng, {
        radius: 3000, // meters
        color: '#22c55e',
        weight: 1,
        fillColor: '#22c55e',
        fillOpacity: 0.4,
      }).addTo(map)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={mapContainerRef} className="h-64 w-full" />
}