import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sprout } from 'lucide-react'

export default function FieldPage() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Field</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Field and harvest overview
        </p>
      </header>

      <Card className="overflow-hidden border border-border">
        <CardHeader>
          <CardTitle className="text-base">Field Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
            <Sprout className="h-16 w-16 text-primary/30" />
            <p className="text-sm">Field content coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
