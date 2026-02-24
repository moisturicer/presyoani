'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Camera,
  XCircle,
  RefreshCw,
  Sprout,
  Clock,
  CheckCircle,
} from 'lucide-react'

const ledgerEntries = [
  { id: 1, qty: '50kg', grade: 'A', crop: 'Tomato', time: '10 mins ago', synced: false },
  { id: 2, qty: '200kg', grade: 'B', crop: 'Rice', time: '1 hour ago', synced: false },
  { id: 3, qty: '30kg', grade: 'A', crop: 'Eggplant', time: '3 hours ago', synced: false },
  { id: 4, qty: '120kg', grade: 'A', crop: 'Corn', time: 'Yesterday', synced: true },
]

export default function FieldPage() {
  const [syncing, setSyncing] = useState(false)
  const pendingCount = ledgerEntries.filter((e) => !e.synced).length

  const handleRetry = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 1500)
  }

  return (
    <div className="flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">Field</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Record harvest and grade
        </p>
      </header>

      <div className="flex flex-col gap-6 p-6">
        {/* Offline alert */}
        <Card className="border border-amber-200 bg-amber-50/90 dark:border-amber-800 dark:bg-amber-950/30">
          <CardContent className="flex flex-row items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">Currently Offline</p>
              {/* Hardcoded */}
              <p className="text-sm text-muted-foreground">
                3 harvests waiting to sync
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              onClick={handleRetry}
              disabled={syncing}
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </CardContent>
        </Card>

        {/* Audit New Harvest CTA */}
        <Button
          size="lg"
          className="h-14 w-full gap-3 bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Camera className="h-6 w-6" />
          Audit New Harvest
        </Button>

        {/* Summary metrics */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                Audits Today
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-secondary/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">400kg</p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                Total Volume
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                Pending Sync
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Local Ledger */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">
              Local Ledger
            </h3>
            <Badge variant="secondary" className="text-xs">
              {pendingCount} Pending
            </Badge>
          </div>
          <div className="flex flex-col gap-3">
            {ledgerEntries.map((entry) => (
              <Card
                key={entry.id}
                className="border border-border bg-card transition-shadow hover:shadow-md"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Sprout className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">
                      {entry.qty} Grade {entry.grade} {entry.crop}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.time}
                    </p>
                  </div>
                  {entry.synced ? (
                    <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Synced
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-amber-600">
                      <Clock className="h-4 w-4" />
                      Pending
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
