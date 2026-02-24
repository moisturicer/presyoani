import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, ShoppingBag, UserCircle } from 'lucide-react'

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 pb-8 pt-6">
        <div className="flex items-center justify-between gap-3">
          <Button
            asChild
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border-border/70 bg-card/70 px-4 py-1.5 text-xs font-medium"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to dashboard
            </Link>
          </Button>
        </div>

        <header className="flex flex-col items-center gap-3 rounded-2xl bg-card/80 px-5 py-4 text-center shadow-sm ring-1 ring-border/70 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            PresyoAni
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Buyer profile
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Your details as a buyer connecting directly with farmers in the PresyoAni pilot.
          </p>
        </header>

        <section className="grid gap-4 rounded-2xl bg-card/70 p-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl md:grid-cols-[1.4fr,1fr]">
          <Card className="border border-border/70 bg-card/95 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  <span className="text-sm font-semibold">JB</span>
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Juan Buyer
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Buyer • Supermarket / Retail
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="gap-1 bg-primary text-primary-foreground">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Buyer account
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs">
                  <UserCircle className="h-3.5 w-3.5" />
                  Connected to PresyoAni pilot
                </Badge>
              </div>

              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Full name
                  </dt>
                  <dd className="text-sm text-foreground">Juan Dela Cruz</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Email
                  </dt>
                  <dd className="text-sm text-foreground">buyer@example.ph</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Organization
                  </dt>
                  <dd className="text-sm text-foreground">Cebu Fresh Mart</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Role in value chain
                  </dt>
                  <dd className="text-sm text-foreground">Urban buyer / aggregator</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Card className="border border-border/70 bg-card/95 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Market focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Cebu City • Central Visayas</span>
                </p>
                <p>Looking for tomato, onion, rice, and corn harvests within driving distance.</p>
              </CardContent>
            </Card>

            <Card className="border border-border/70 bg-card/95 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Connection to farmers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  This profile represents a <span className="font-semibold text-foreground">buyer</span> in the
                  PresyoAni pilot. In the full product, farmers would have their own mirrored
                  profiles highlighting farm location, crops, and certifications.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

