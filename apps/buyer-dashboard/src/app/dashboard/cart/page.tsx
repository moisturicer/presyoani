'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Leaf, Trash2, ArrowLeft } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

export default function CartPage() {
  const router = useRouter()
  const { items, clearCart, removeItem } = useCart()

  useEffect(() => {
    let isMounted = true

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!isMounted) return

        if (!data.user) {
          router.replace('/login')
        }
      })

    return () => {
      isMounted = false
    }
  }, [router])

  const hasItems = items.length > 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 pb-8 pt-6">
        <div>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="w-fit gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Button>
          </Link>
        </div>

        <header className="flex flex-col gap-3 rounded-2xl bg-card/80 px-5 py-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Cart
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Items here are <span className="font-semibold">temporary</span> and will be cleared when your
              session ends (for example when you sign out or close this browser tab), so produce does not stay in your cart for too long.
            </p>
          </div>
          {hasItems && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4" />
                Clear cart
              </Button>
            </div>
          )}
        </header>

        <section className="rounded-2xl bg-card/70 p-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl">
          {!hasItems ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <p className="text-base font-medium text-foreground">
                Your cart is empty.
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                Add harvests from the Buyer dashboard to review them here during your current session. Items are not reserved and will automatically disappear after the session.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="border border-border/60"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Leaf className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-foreground">
                            {item.crop}
                          </span>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            {item.volume}
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {item.location}
                          </span>
                          <span>{item.farmer}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                        aria-label={`Remove ${item.crop} from cart`}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

