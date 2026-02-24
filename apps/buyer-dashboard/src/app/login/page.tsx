/* eslint-disable @next/next/no-img-element */
'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // No real auth for now – just navigate to the dashboard
    router.push('/dashboard')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 landing-bg">
      <div className="grain-overlay fixed inset-0 z-0" aria-hidden />

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float"
          aria-hidden
        />
        <div
          className="absolute -right-16 top-1/2 h-80 w-80 rounded-full bg-secondary/25 blur-3xl animate-float-slow"
          aria-hidden
        />
        <div
          className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-primary/15 blur-3xl animate-float-slower"
          aria-hidden
        />
        <div
          className="absolute right-1/4 top-1/5 h-48 w-48 rounded-full bg-secondary/20 blur-2xl animate-float"
          aria-hidden
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-10 text-center sm:flex-row sm:items-stretch sm:text-left">
        <div className="flex-1 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/40 transition hover:bg-primary/90 hover:ring-primary/50"
          >
            <Image
              src="/PresyoAni-Light.svg"
              alt="PresyoAni"
              width={18}
              height={18}
              className="h-4 w-4 object-contain"
            />
            Back to landing
          </Link>

          <div className="mt-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/90">
              PresyoAni
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {mode === 'login' ? 'Welcome back, buyer' : 'Join the PresyoAni network'}
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              {mode === 'login'
                ? 'Sign in to connect directly with verified farmers, track live harvests, and view transparent market prices.'
                : 'Create a buyer account to discover fresh harvests, support local farmers, and negotiate with confidence.'}
            </p>
          </div>

          <div className="hidden rounded-2xl bg-card/70 p-4 text-left text-sm text-muted-foreground shadow-sm ring-1 ring-border/60 backdrop-blur-xl sm:block">
            <p className="font-semibold text-foreground">Why buyers use PresyoAni</p>
            <ul className="mt-2 space-y-1.5 text-xs">
              <li>• Direct lines to smallholder and mid-scale farmers</li>
              <li>• Live view of harvest volumes around your market</li>
              <li>• Guidance on fair pricing based on local conditions</li>
            </ul>
          </div>
        </div>

        <Card className="flex-1 max-w-md border border-border/70 bg-card/90 shadow-xl backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {mode === 'login' ? 'Sign in to your buyer dashboard' : 'Create your buyer account'}
              </CardTitle>
              <div className="inline-flex items-center rounded-full bg-muted p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                    mode === 'login'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                    mode === 'signup'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  Sign up
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-muted-foreground">
                      First name
                    </label>
                    <Input required placeholder="Juan" className="h-10 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-muted-foreground">
                      Last name
                    </label>
                    <Input required placeholder="Dela Cruz" className="h-10 text-sm" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-muted-foreground">
                  Work email
                </label>
                <Input
                  type="email"
                  required
                  placeholder="you@company.ph"
                  className="h-10 text-sm"
                />
              </div>

              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Organization
                  </label>
                  <Input
                    required
                    placeholder="Supermarket, distributor, restaurant..."
                    className="h-10 text-sm"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <Input
                  type="password"
                  required
                  placeholder="Enter a secure password"
                  className="h-10 text-sm"
                />
              </div>

              <Button
                type="submit"
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
              >
                {mode === 'login' ? 'Continue to dashboard' : 'Create account'}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground">
              No real authentication is wired yet. For this prototype, any details you enter will
              simply bring you to the buyer dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

