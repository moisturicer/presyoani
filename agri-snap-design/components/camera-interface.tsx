"use client"

import { useState } from "react"
import {
  Camera,
  RotateCcw,
  Zap,
  Check,
  X,
  ScanLine,
  Cpu,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type CameraState = "ready" | "analyzing" | "result"

export function CameraInterface() {
  const [state, setState] = useState<CameraState>("ready")

  return (
    <div className="relative flex h-full flex-col">
      {/* Camera Viewfinder */}
      <div className="relative flex flex-1 items-center justify-center bg-foreground/95">
        {/* Simulated camera view */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />

        {/* Scanning overlay */}
        <div className="relative flex h-64 w-64 items-center justify-center">
          {/* Corner brackets */}
          <div className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-secondary rounded-tl-lg" />
          <div className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-secondary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-secondary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-secondary rounded-br-lg" />

          {state === "analyzing" && (
            <div className="flex flex-col items-center gap-3">
              <Cpu className="h-10 w-10 animate-pulse text-secondary" />
              <span className="text-sm font-bold text-secondary">
                Edge AI Processing...
              </span>
            </div>
          )}

          {state === "ready" && (
            <div className="flex flex-col items-center gap-2">
              <ScanLine className="h-8 w-8 text-secondary/60" />
              <span className="text-xs font-medium text-secondary/60">
                Position crop in frame
              </span>
            </div>
          )}
        </div>

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-foreground/90 to-transparent" />

        {/* Status text */}
        {state === "analyzing" && (
          <div className="absolute inset-x-0 bottom-6 text-center">
            <p className="text-lg font-bold text-primary-foreground">
              Analyzing Crop...
            </p>
            <p className="mt-1 text-sm text-primary-foreground/70">
              Using on-device AI model
            </p>
          </div>
        )}

        {state === "ready" && (
          <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-primary-foreground/70">
              Tap the button to scan your harvest
            </p>
            <Button
              size="lg"
              onClick={() => {
                setState("analyzing")
                setTimeout(() => setState("result"), 2000)
              }}
              className="h-16 w-16 rounded-full bg-secondary p-0 shadow-lg shadow-secondary/30 hover:bg-secondary/90 active:scale-95"
              aria-label="Take photo"
            >
              <Camera className="h-7 w-7 text-secondary-foreground" />
            </Button>
          </div>
        )}
      </div>

      {/* Top controls */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
        <Badge className="bg-foreground/60 text-primary-foreground border-0">
          <Zap className="mr-1 h-3 w-3" />
          Edge AI
        </Badge>
        <Badge className="bg-red-500/80 text-primary-foreground border-0">
          Offline Mode
        </Badge>
      </div>

      {/* Results Panel */}
      {state === "result" && (
        <div className="absolute inset-x-0 bottom-0 animate-in slide-in-from-bottom">
          <Card className="mx-3 mb-3 border-2 border-secondary shadow-2xl rounded-2xl">
            <CardContent className="p-0">
              {/* Result Header */}
              <div className="flex items-center gap-3 rounded-t-2xl bg-primary p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Check className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-foreground">
                    Crop Identified Successfully
                  </p>
                  <p className="text-xs text-primary-foreground/70">
                    AI Confidence: 94.7%
                  </p>
                </div>
              </div>

              {/* Result Details */}
              <div className="grid grid-cols-3 gap-3 p-4">
                <ResultItem label="Crop" value="Tomato" />
                <ResultItem label="Quality" value="Grade A" highlight />
                <ResultItem label="Est. Volume" value="50kg" />
              </div>

              {/* Market Price Preview */}
              <div className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-secondary/10 p-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Current Market Price
                  </p>
                  <p className="text-lg font-black text-foreground">
                    {"₱45/kg"}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 p-4 pt-0">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-2 bg-transparent"
                  onClick={() => setState("ready")}
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake
                </Button>
                <Button
                  className="flex-1 gap-2 bg-primary text-primary-foreground"
                  onClick={() => setState("ready")}
                >
                  <Check className="h-4 w-4" />
                  Save to Ledger
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function ResultItem({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-muted p-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-bold ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  )
}
