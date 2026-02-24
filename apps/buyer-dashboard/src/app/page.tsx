import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex items-center justify-center rounded-2xl bg-primary/10 p-4">
          <Leaf className="h-16 w-16 text-primary" aria-hidden />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          PresyoAni
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
        Empowering the field, even when the bars are down.
        Connect directly with farmers.
        </p>
        <Link
          href="/dashboard"
          className="mt-10 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Get started
        </Link>
      </div>
    </main>
  )
}
