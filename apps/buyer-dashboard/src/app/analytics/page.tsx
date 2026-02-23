import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Crop and yield analytics
        </p>
      </header>

      <Card className="overflow-hidden border border-border">
        <CardHeader>
          <CardTitle className="text-base">Supply Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
            <BarChart3 className="h-16 w-16 text-primary/30" />
            <p className="text-sm">Charts and data tables coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
