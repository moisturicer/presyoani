/* eslint-disable @next/next/no-img-element */
'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabaseClient'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [isRegistered, setIsRegistered] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const cleanEmail = email.trim().toLowerCase()

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })

        if (signInError) {
          setError(signInError.message)
          return
        }
      } else {

        // start here for issue #3
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (checkError) {
          console.error("Database check failed:", checkError.message);
          setError("System is temporarily busy. Please try again later.");
          setIsSubmitting(false);
          return;
        }

        if (existingUser) {
          setError("This email is already registered. Try logging in.")
          console.log('email is already used.')
          setIsSubmitting(false)
          setMode('login');
          return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              role: 'buyer',
              first_name: firstName,
              last_name: lastName,
              organization_name: organization,
            },
          },
        })

        if (signUpError) {
          setError(signUpError.message)
          setIsSubmitting(false)
          return
        }

        if (!data.session) {
          setIsRegistered(true)
          setIsSubmitting(false)
          return
        }
      }

      router.push('/dashboard')
    } finally {
      setIsSubmitting(false)
    }
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
                  className={`rounded-full px-3 py-1 font-semibold transition-colors ${mode === 'login'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground'
                    }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`rounded-full px-3 py-1 font-semibold transition-colors ${mode === 'signup'
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
            {isRegistered ? (
              <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                  📧
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold">Check your inbox</h3>
                  <p className="text-xs text-muted-foreground">
                    We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>.
                    Please confirm your email before logging in.
                  </p>
                </div>
                <Button
                  onClick={() => { setIsRegistered(false); setMode('login'); }}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-muted-foreground">
                          First name
                        </label>
                        <Input
                          required
                          placeholder="Juan"
                          className="h-10 text-sm"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Last name
                        </label>
                        <Input
                          required
                          placeholder="Dela Cruz"
                          className="h-10 text-sm"
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                        />
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
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
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
                        value={organization}
                        onChange={(event) => setOrganization(event.target.value)}
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
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
                  >
                    {isSubmitting
                      ? mode === 'login'
                        ? 'Signing in...'
                        : 'Creating account...'
                      : mode === 'login'
                        ? 'Continue to dashboard'
                        : 'Create account'}
                  </Button>
                </form>

                {error && (
                  <p className="text-xs font-medium text-destructive">
                    {error}
                  </p>
                )}

                {mode === 'signup' && !error && (
                  <p className="text-xs text-muted-foreground">
                    After signing up, you may receive a verification email depending on your Supabase
                    auth settings.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


