'use client'

import type { ReactNode } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { CartProvider } from '@/components/cart/CartContext'

export function DashboardFrame({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Sidebar />

        {/* Background layers live outside the scroll container so they aren't clipped */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <div className="absolute -left-20 top-1/5 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-float" />
          <div className="absolute -right-16 top-1/2 h-80 w-80 rounded-full bg-secondary/35 blur-3xl animate-float-slow" />
          <div className="absolute bottom-1/4 left-1/4 h-56 w-56 rounded-full bg-primary/25 blur-2xl animate-float-slower" />
          <div className="absolute right-1/3 top-1/4 h-48 w-48 rounded-full bg-secondary/30 blur-2xl animate-float" />
        </div>
        <div
          className="pointer-events-none fixed inset-0 z-0 dotted-grid-bg opacity-40"
          aria-hidden
        />

        <div className="relative z-10 min-h-0 flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </CartProvider>
  )
}

