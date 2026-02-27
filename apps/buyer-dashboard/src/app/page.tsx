'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BarChart3, Shield, Users } from 'lucide-react'
import { SyncService } from '../service/sync_service'

export default function LandingPage() {
  
  useEffect(() => {
    const runSync = () => {
      SyncService.syncCommodities().catch(err => 
          console.error("Manual sync failed:", err)
      );
    };

    runSync();

    window.addEventListener('online', runSync);

    return () => {
      window.removeEventListener('online', runSync);
    };
  }, []);
  
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 landing-bg">
      {/* Grain overlay */}
      <div className="grain-overlay fixed inset-0 z-0" aria-hidden />

      {/* Floating background blobs */}
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

      {/* Subtle grid pattern */}
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

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        
        <div
          className="mb-8 flex items-center justify-center rounded-2xl bg-primary/10 p-5 shadow-lg ring-1 ring-primary/10 animate-fade-in-up animate-glow-pulse"
          style={{ animationFillMode: 'both' }}
        >
          <Image
            src="/PresyoAni.svg"
            alt=""
            width={72}
            height={72}
            className="h-20 w-20 object-contain drop-shadow-sm"
            aria-hidden
            priority
          />
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up-delay-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            PresyoAni
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="mt-5 max-w-lg animate-fade-in-up-delay-2 text-lg leading-relaxed text-muted-foreground sm:text-xl"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          Empowering the field, even when the bars are down.
          <br className="hidden sm:block" />
          Connect directly with farmers.
        </p>

        {/* Feature pills */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up-delay-3 sm:gap-4"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/10">
            <Users className="h-4 w-4 text-primary" aria-hidden />
            Direct connections
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" aria-hidden />
            Live insights
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/10">
            <Shield className="h-4 w-4 text-primary" aria-hidden />
            Transparent pricing
          </span>
        </div>

        {/* CTAs */}
        <div
          className="mt-12 flex flex-col items-center gap-4 animate-fade-in-up-delay-4 sm:flex-row sm:gap-5"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <span className="relative z-10">Get started</span>
            <span
              className="absolute inset-0 -z-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
          </Link>
          <Link
            href="/learn-more"
            className="inline-flex items-center justify-center rounded-xl border-2 border-primary/30 bg-background/80 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Learn more
          </Link>
        </div>

      </div>
    </main>
  )
}
