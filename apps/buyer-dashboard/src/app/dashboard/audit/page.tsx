'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Camera } from 'lucide-react'

export default function AuditPage() {
  const [scanning, setScanning] = useState(false)

  return (
    <div className="flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">Audit</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Audit new harvest and records
        </p>
      </header> 

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md overflow-hidden border-2 border-primary/20 bg-primary">  
          <CardContent className="relative flex flex-col items-center justify-center p-0">
            {/* Viewfinder frame - aspect ratio similar to mobile scanner */}
            <div className="relative flex aspect-[1/2] w-full max-h-[min(180vh,780px)] flex-col items-center justify-center">
              {/* Corner guides (L-shaped) */}
              <div className="absolute left-4 top-4 h-12 w-12 border-l-4 border-t-4 border-secondary rounded-tl-lg" />
              <div className="absolute right-4 top-4 h-12 w-12 border-r-4 border-t-4 border-secondary rounded-tr-lg" />
              <div className="absolute bottom-24 left-4 h-12 w-12 border-l-4 border-b-4 border-secondary rounded-bl-lg" />
              <div className="absolute bottom-24 right-4 h-12 w-12 border-r-4 border-b-4 border-secondary rounded-br-lg" />

              {/* Instruction text */}
              <p className="relative z-10 px-6 text-center text-lg font-medium text-primary-foreground">
                Tap the button to scan your harvest
              </p>
            </div>

            {/* Scan button */}
            <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
              <button
                type="button"
                onClick={() => setScanning(!scanning)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary active:scale-95"
                aria-label="Scan harvest"
              >
                <Camera
                  className={`h-8 w-8 text-secondary-foreground ${scanning ? 'animate-pulse' : ''}`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


