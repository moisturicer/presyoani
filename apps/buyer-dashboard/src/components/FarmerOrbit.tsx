'use client'

import Image from 'next/image'

/** 8 orbiting farmer image boxes (8 for SDG 8 – Decent Work and Economic Growth). */
const BOX_COUNT = 8
const ORBIT_RADIUS = 600
const ORBIT_DURATION = 35 // seconds

export function FarmerOrbit() {
  return (
    <div
      className="farmer-orbit-container pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      aria-hidden
    >
      <div
        className="farmer-orbit-ring relative"
        style={{
          width: ORBIT_RADIUS * 2,
          height: ORBIT_RADIUS * 2,
          animationDuration: `${ORBIT_DURATION}s`,
        }}
      >
        {Array.from({ length: BOX_COUNT }).map((_, i) => {
          const angle = (i / BOX_COUNT) * 360
          const x = 50 + 50 * Math.cos((angle * Math.PI) / 180)
          const y = 50 + 50 * Math.sin((angle * Math.PI) / 180)
          const delaySeconds = -(i / BOX_COUNT) * ORBIT_DURATION

          return (
            <div
              key={i}
              className="farmer-orbit-box-outer absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              {/* Counter-rotate wrapper: keeps box upright as it orbits */}
              <div
                className="farmer-orbit-box-counter"
                style={{ animationDuration: `${ORBIT_DURATION}s` }}
              >
                <div
                  className="farmer-orbit-box farmer-orbit-box-inner relative h-[230px] w-[230px] overflow-hidden rounded-2xl border-2 border-primary shadow-md"
                  style={{
                    animationDelay: `${delaySeconds}s`,
                    animationDuration: `${ORBIT_DURATION}s`,
                  }}
                >
                  <div className="farmer-orbit-mute absolute inset-0">
                    <Image
                      src={`/images/img${i + 1}.jpg`}
                      alt={`Farmer ${i + 1}`}
                      fill
                      className="farmer-orbit-img object-cover"
                      sizes="200px"
                      style={{
                        animationDelay: `${delaySeconds}s`,
                        animationDuration: `${ORBIT_DURATION}s`,
                      }}
                    />
                    {/* White overlay – strong when shrunk (blurry/white-ish), light when at middle Y */}
                    <div
                      className="farmer-orbit-overlay pointer-events-none absolute inset-0 rounded-2xl bg-background"
                      aria-hidden
                      style={{
                        animationDelay: `${delaySeconds}s`,
                        animationDuration: `${ORBIT_DURATION}s`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
