"use client"

import { Camera, CloudOff, RefreshCw, CheckCircle2, Clock, Leaf } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const pendingHarvests = [
  {
    id: 1,
    crop: "Tomato",
    grade: "Grade A",
    volume: "50kg",
    time: "10 mins ago",
    status: "pending" as const,
  },
  {
    id: 2,
    crop: "Rice",
    grade: "Grade B",
    volume: "200kg",
    time: "1 hour ago",
    status: "pending" as const,
  },
  {
    id: 3,
    crop: "Corn",
    grade: "Grade A",
    volume: "120kg",
    time: "3 hours ago",
    status: "synced" as const,
  },
  {
    id: 4,
    crop: "Eggplant",
    grade: "Grade A",
    volume: "30kg",
    time: "Yesterday",
    status: "pending" as const,
  },
]

const cropIcons: Record<string, string> = {
  Tomato: "/icons/tomato.svg",
  Rice: "/icons/rice.svg",
  Corn: "/icons/corn.svg",
  Eggplant: "/icons/eggplant.svg",
}

export function FarmerDashboard() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Offline Status Banner */}
      <Card className="border-2 border-secondary bg-secondary/10">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15">
            <CloudOff className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">
              Currently Offline
            </p>
            <p className="text-xs text-muted-foreground">
              3 harvests waiting to sync
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-primary/30 text-primary bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>

      {/* Big Audit Button */}
      <Button
        size="lg"
        className="h-20 gap-3 rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-[0.98]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <Camera className="h-6 w-6 text-secondary-foreground" />
        </div>
        Audit New Harvest
      </Button>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 bg-primary/5">
          <CardContent className="flex flex-col items-center p-3">
            <span className="text-2xl font-black text-primary">4</span>
            <span className="text-xs font-medium text-muted-foreground">
              Audits Today
            </span>
          </CardContent>
        </Card>
        <Card className="border-0 bg-secondary/10">
          <CardContent className="flex flex-col items-center p-3">
            <span className="text-2xl font-black text-foreground">400kg</span>
            <span className="text-xs font-medium text-muted-foreground">
              Total Volume
            </span>
          </CardContent>
        </Card>
        <Card className="border-0 bg-primary/5">
          <CardContent className="flex flex-col items-center p-3">
            <span className="text-2xl font-black text-primary">3</span>
            <span className="text-xs font-medium text-muted-foreground">
              Pending Sync
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Local Ledger */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Local Ledger</h2>
          <Badge variant="secondary" className="text-xs">
            {pendingHarvests.filter((h) => h.status === "pending").length}{" "}
            Pending
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          {pendingHarvests.map((harvest) => (
            <Card
              key={harvest.id}
              className="border border-border/60 transition-colors hover:border-primary/30"
            >
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <CropIcon crop={harvest.crop} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {harvest.volume} {harvest.grade} {harvest.crop}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {harvest.time}
                  </span>
                </div>
                {harvest.status === "synced" ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-semibold">Synced</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-secondary-foreground/70">
                    <Clock className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-semibold">Pending</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function CropIcon({ crop }: { crop: string }) {
  return <Leaf className="h-5 w-5 text-primary" aria-label={crop} />
}
