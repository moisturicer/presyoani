/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, ShoppingBag, UserCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

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
                  Your buyer profile is shared with farmers you connect with on{' '}
                  <span className="font-semibold text-foreground">PresyoAni</span>. It helps them understand who they
                  are negotiating with – your organization, approximate scale, and preferred crops – so they can decide
                  what to offer and when to reach out.
                </p>
              </CardContent>
            </Card>
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

