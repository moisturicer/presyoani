'use client'

import type { ReactNode } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { CartProvider } from '@/components/cart/CartContext'

export function DashboardFrame({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Sidebar />
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </CartProvider>
  )
}

