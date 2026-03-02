/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const PRODUCE_OPTIONS = [
  'Tomato',
  'Onion',
  'Rice',
  'Corn',
  'Eggplant',
  'Cabbage',
  'Squash',
  'Bell Pepper',
  'Garlic',
  'Ginger',
  'Okra',
  'String Beans',
] as const

function MarketFocusSection() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (item: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })
  }

  return (
    <Card className="border border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Market focus</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span>Cebu City • Central Visayas</span>
        </p>
        <p className="font-medium text-foreground">What are you looking for today?</p>
        <div className="flex flex-wrap gap-2">
          {PRODUCE_OPTIONS.map((item) => {
            const isSelected = selected.has(item)
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-foreground'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
        {selected.size > 0 && (
          <p className="text-xs text-muted-foreground">
            Selected: {Array.from(selected).join(', ')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function ConnectionCard() {
  return (
    <Card className="border border-border/70 bg-card/95 shadow-sm h-full min-h-0 flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-sm font-semibold">How you’re connected</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground flex-1 min-h-0 overflow-auto">
        <p>
          When you add harvests to your cart or show interest, farmers in Cebu see real demand.
          Your profile gives them a clear picture of who’s buying—so they can plan the next planting
          season and time their harvests to what buyers actually want.
        </p>
        <p>
          Less guesswork, less waste, and prices that work for both sides. That’s the{' '}
          <span className="font-semibold text-foreground">PresyoAni</span> link.
        </p>
      </CardContent>
    </Card>
  )
}

type BuyerProfile = {
  fullName: string
  email: string
  organization: string | null
  roleLabel: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<BuyerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!isMounted) return

        const user = data.user
        if (!user) {
          router.replace('/login')
          return
        }

        const meta = user.user_metadata ?? {}
        const first = (meta.first_name as string | undefined) ?? ''
        const last = (meta.last_name as string | undefined) ?? ''
        const organization = (meta.organization_name as string | undefined) ?? null
        const role = (meta.role as string | undefined) ?? 'buyer'

        const fullName =
          [first, last].filter(Boolean).join(' ') || user.email || 'Buyer account'

        setProfile({
          fullName,
          email: user.email ?? 'Unknown email',
          organization,
          roleLabel: role === 'buyer' ? 'Buyer' : role,
        })
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
  }, [router])

  const initials = useMemo(() => {
    const source = profile?.fullName || profile?.email || ''
    if (!source) return 'B'
    const parts = source.trim().split(/\s+/)
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }, [profile])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background/70 via-background/60 to-background/70">
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

        <section className="flex flex-col gap-4 rounded-2xl bg-card/70 p-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl">
          {/* Top row: left wider, right shorter */}
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <Card className="border border-border/70 bg-card/95 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    <span className="text-sm font-semibold">
                      {initials}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    {loading ? 'Loading buyer...' : profile?.fullName ?? 'Buyer account'}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {loading
                      ? 'Fetching buyer details'
                      : `${profile?.roleLabel ?? 'Buyer'}${
                          profile?.organization ? ` • ${profile.organization}` : ''
                        }`}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="gap-1 bg-primary text-primary-foreground">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Buyer account
                  </Badge>
                </div>

                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Full name
                    </dt>
                    <dd className="text-sm text-foreground">
                      {loading ? 'Loading...' : profile?.fullName ?? 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Email
                    </dt>
                    <dd className="text-sm text-foreground">
                      {loading ? 'Loading...' : profile?.email ?? 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Organization
                    </dt>
                    <dd className="text-sm text-foreground">
                      {loading
                        ? 'Loading...'
                        : profile?.organization ?? 'Add your organization from your account'}
                    </dd>
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

            <MarketFocusSection />
          </div>

          {/* Bottom row: left square (logo), right same height */}
          <div className="grid gap-4 md:grid-cols-[auto_1fr] md:h-36">
            <Card className="border border-border/70 bg-primary/5 shadow-sm flex flex-col items-center justify-center w-36 h-36 p-4 ring-1 ring-primary/10 shrink-0 aspect-square">
              <Image
                src="/PresyoAni.svg"
                alt="PresyoAni"
                width={50}
                height={50}
                className="h-20 w-20 object-contain drop-shadow-sm"
              />
            </Card>

            <ConnectionCard />
          </div>
        </section>
        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-red-900/90 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-900"
            onClick={async () => {
              await supabase.auth.signOut()
              router.replace('/login')
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </main>
  )
}

