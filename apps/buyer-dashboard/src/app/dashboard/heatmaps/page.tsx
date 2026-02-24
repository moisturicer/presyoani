import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf } from 'lucide-react'

export default function HeatmapsPage() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Harvest Heatmaps</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Map of available crops by location
        </p>
      </header>

      <Card className="overflow-hidden border border-border">
        <CardHeader>
          <CardTitle className="text-base">Regional Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative flex h-96 items-center justify-center bg-primary/5">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Leaf className="h-16 w-16 text-primary/30" />
              <p className="text-sm">Full map view coming soon</p>
              <p className="text-xs">Integrate with map library (e.g. Mapbox, Leaflet)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
