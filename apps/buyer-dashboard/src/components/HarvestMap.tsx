'use client'

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const CEBU_CENTER: [number, number] = [10.3157, 123.8854]


function HarvestMapContent() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || typeof window === 'undefined') return

    mapRef.current = L.map(mapContainerRef.current, {
      center: CEBU_CENTER,
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current)

    const points: [number, number][] = [
      [10.3157, 123.8854],
      [10.2926, 123.9416],
      [10.2447, 123.8494],
    ]

    points.forEach((latlng) => {
      L.circle(latlng, {
        radius: 2000,
        color: '#22c55e',
        weight: 1,
        fillColor: '#22c55e',
        fillOpacity: 0.4,
      }).addTo(mapRef.current!)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full rounded-xl border border-gray-200 shadow-sm"
      style={{ minHeight: '300px' }}
    />
  )
}

export const HarvestMap = dynamic(
  () => Promise.resolve(HarvestMapContent),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full bg-gray-50 animate-pulse flex items-center justify-center rounded-xl border border-gray-100">
        <span className="text-gray-400 text-sm">Initializing Map...</span>
      </div>
    )
  }
)