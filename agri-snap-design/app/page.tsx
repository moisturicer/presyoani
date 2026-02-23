"use client"

import { useState } from "react"
import {
  Sprout,
  Camera,
  TrendingUp,
  ShoppingCart,
  Bell,
} from "lucide-react"
import { FarmerDashboard } from "@/components/farmer-dashboard"
import { CameraInterface } from "@/components/camera-interface"
import { PriceAlertScreen } from "@/components/price-alert-screen"
import { BuyerDashboard } from "@/components/buyer-dashboard"
import { HandshakeScreen } from "@/components/handshake-screen"

const screens = [
  { id: "dashboard", label: "Field", icon: Sprout },
  { id: "camera", label: "Audit", icon: Camera },
  { id: "prices", label: "Insight", icon: TrendingUp },
  { id: "buyer", label: "Buyer", icon: ShoppingCart },
  { id: "handshake", label: "Alerts", icon: Bell },
] as const

type ScreenId = (typeof screens)[number]["id"]

export default function AgriSnapApp() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>("dashboard")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between bg-primary px-4 py-3">
        <div className="flex items-center gap-2">
          <Sprout className="h-7 w-7 text-secondary" />
          <span className="text-xl font-bold tracking-tight text-primary-foreground">
            AgriSnap
          </span>
        </div>
        <div className="flex items-center gap-2">
          <OnlineIndicator />
        </div>
      </header>

      {/* Screen Content */}
      <main className="flex-1 overflow-y-auto">
        {activeScreen === "dashboard" && <FarmerDashboard />}
        {activeScreen === "camera" && <CameraInterface />}
        {activeScreen === "prices" && <PriceAlertScreen />}
        {activeScreen === "buyer" && <BuyerDashboard />}
        {activeScreen === "handshake" && <HandshakeScreen />}
      </main>

      {/* Bottom Navigation */}
      <nav className="border-t-2 border-border bg-card">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {screens.map((screen) => {
            const Icon = screen.icon
            const isActive = activeScreen === screen.id
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => setActiveScreen(screen.id)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={`Navigate to ${screen.label}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`h-6 w-6 ${isActive ? "text-primary" : ""}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span>{screen.label}</span>
                {isActive && (
                  <span className="mt-0.5 h-1 w-6 rounded-full bg-secondary" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function OnlineIndicator() {
  const [isOnline, setIsOnline] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setIsOnline(!isOnline)}
      className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1"
      aria-label={`Status: ${isOnline ? "Online" : "Offline"}. Click to toggle.`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isOnline ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]"
        }`}
      />
      <span className="text-xs font-bold text-primary-foreground">
        {isOnline ? "Online" : "Offline"}
      </span>
    </button>
  )
}
