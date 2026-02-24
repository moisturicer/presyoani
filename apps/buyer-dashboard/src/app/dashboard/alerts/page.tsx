'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, HelpCircle, MessageCircle, Phone } from 'lucide-react'

const connections = [
  {
    id: 1,
    company: 'Nestle Philippines',
    message:
      'Interested in your 100kg Tomatoes. Call +63 917 XXX 1234 to negotiate.',
    time: '2 mins ago',
    isNew: true,
  },
  {
    id: 2,
    company: 'Metro Fresh Market',
    message: 'Deal accepted for 500kg Rice. Pickup scheduled.',
    time: '1 hour ago',
    isNew: true,
  },
  {
    id: 3,
    company: 'Local Cooperative',
    message:
      'Interested in your 200kg Corn. Call +63 935 XXX 9012 to negotiate.',
    time: '3 hours ago',
    isNew: false,
  },
]

const newCount = connections.filter((c) => c.isNew).length

export default function AlertsPage() {
  return (
    <div className="flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">Connections</h1>
          {newCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-secondary/90 text-secondary-foreground"
            >
              {newCount} New
            </Badge>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Buyer interest & direct contacts
        </p>
      </header>

      <div className="flex flex-col gap-4 p-6">
        {connections.map((connection) => (
          <Card
            key={connection.id}
            className={`transition-shadow hover:shadow-md ${
              connection.isNew
                ? 'border-2 border-secondary/70 bg-card'
                : 'border border-border bg-card'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                    connection.isNew ? 'bg-primary/15' : 'bg-muted'
                  }`}
                >
                  <HelpCircle
                    className={`h-5 w-5 ${
                      connection.isNew ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {connection.company}
                    </span>
                    {connection.isNew && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full bg-secondary"
                        aria-hidden
                      />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {connection.message}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {connection.time}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-border bg-muted/50 hover:bg-muted"
                  >
                    <MessageCircle className="h-4 w-4" />
                    SMS
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
