'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Leaf,
  Trash2,
  ArrowLeft,
  Star,
  PackageCheck,
  CreditCard,
  Store,
  Truck,
} from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

type Step = 'checkout' | 'payment' | 'status'
type Fulfillment = 'pickup' | 'delivery'

export default function CartPage() {
  const router = useRouter()
  const { items, clearCart, removeItem } = useCart()
  const [step, setStep] = useState<Step>('checkout')
  const [fulfillment, setFulfillment] = useState<Fulfillment>('pickup')
  const [orderPlaced, setOrderPlaced] = useState(false)

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

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (item.price ?? 0) * item.weightKg, 0),
    [items],
  )

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
          {!hasItems && (
            <div className="flex flex-col items-center justify-center gap-3 pb-8 text-center">
              <p className="text-base font-medium text-foreground">
                Your cart is empty.
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                Add harvests from the Buyer dashboard to review them here during your current session. Items are not reserved and will automatically disappear after the session.
              </p>
            </div>
          )}

          {/* Step indicator / tracking bar */}
          <div className="flex items-center w-full mb-4">
            <Badge
              variant={step === 'checkout' ? 'default' : 'outline'}
              className="gap-1 shrink-0"
            >
              <PackageCheck className="h-3.5 w-3.5" />
              Checkout
            </Badge>
            <div
              className={`h-0.5 flex-1 min-w-[24px] mx-1 transition-colors ${
                step === 'payment' || step === 'status' ? 'bg-primary' : 'bg-muted'
              }`}
              aria-hidden
            />
            <Badge
              variant={step === 'payment' ? 'default' : 'outline'}
              className="gap-1 shrink-0"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Payment
            </Badge>
            <div
              className={`h-0.5 flex-1 min-w-[24px] mx-1 transition-colors ${
                step === 'status' ? 'bg-primary' : 'bg-muted'
              }`}
              aria-hidden
            />
            <Badge
              variant={step === 'status' ? 'default' : 'outline'}
              className="gap-1 shrink-0"
            >
              {fulfillment === 'delivery' ? (
                <Truck className="h-3.5 w-3.5" />
              ) : (
                <Store className="h-3.5 w-3.5" />
              )}
              Status
            </Badge>
          </div>

          {/* Items list */}
          <div className="flex flex-col gap-3 mb-4">
            {hasItems ? (
              items.map((item) => (
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
                            {item.commodity}
                          </span>
                          {item.grade ? (
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              Grade {item.grade}
                            </Badge>
                          ) : null}
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            {item.weightKg}kg
                          </Badge>
                          {item.price !== null ? (
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              ₱{item.price.toFixed(0)}/kg
                            </Badge>
                          ) : null}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5" />
                            {item.rating.toFixed(2)}
                          </span>
                          <span>{item.farmer}</span>
                        </div>
                      </div>
                      {step === 'checkout' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                          aria-label={`Remove ${item.commodity} from cart`}
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="px-1 text-sm text-muted-foreground">
                No items yet. Add harvests from the Buyer dashboard to review them here.
              </p>
            )}
          </div>

          {/* Checkout / Payment / Status card */}
          <Card className="border border-border/60">
            <CardContent className="p-4 flex flex-col gap-3">
              {step === 'checkout' && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Checkout</p>
                    <p className="text-sm font-semibold text-foreground">
                      Total: ₱{total.toFixed(0)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={fulfillment === 'pickup' ? 'default' : 'outline'}
                      size="sm"
                      className="gap-1"
                      onClick={() => setFulfillment('pickup')}
                    >
                      <Store className="h-4 w-4" />
                      Pickup
                    </Button>
                    <Button
                      type="button"
                      variant={fulfillment === 'delivery' ? 'default' : 'outline'}
                      size="sm"
                      className="gap-1"
                      onClick={() => setFulfillment('delivery')}
                    >
                      <Truck className="h-4 w-4" />
                      Delivery
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      disabled={!hasItems}
                      onClick={() => setStep('payment')}
                    >
                      Continue to payment
                    </Button>
                  </div>
                </>
              )}

              {step === 'payment' && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Payment</p>
                    <p className="text-sm font-semibold text-foreground">
                      Total: ₱{total.toFixed(0)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Demo only – no real payment is processed.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="gap-1"
                    >
                      <CreditCard className="h-4 w-4" />
                      GCash
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <CreditCard className="h-4 w-4" />
                      Cash
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setStep('checkout')}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setOrderPlaced(true)
                        setStep('status')
                        if (hasItems) {
                          clearCart()
                        }
                      }}
                      disabled={!hasItems}
                    >
                      Place order
                    </Button>
                  </div>
                </>
              )}

              {step === 'status' && (
                <>
                  <p className="text-sm font-semibold text-foreground">Order status</p>
                  <p className="text-sm text-muted-foreground">
                    {orderPlaced
                      ? fulfillment === 'delivery'
                        ? 'Your order is on the way.'
                        : 'Your order is ready for pickup.'
                      : 'No active order.'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Link href="/dashboard">
                      <Button
                        type="button"
                        size="sm"
                      >
                        Back to dashboard
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setOrderPlaced(false)
                        setStep('checkout')
                      }}
                    >
                      New order
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

