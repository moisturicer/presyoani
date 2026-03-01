'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  id: number
  commodity: string
  grade: string | null
  weightKg: number
  price: number | null
  farmer: string
  rating: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'buyer-dashboard-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null
      if (stored) {
        const parsed = JSON.parse(stored) as unknown
        if (Array.isArray(parsed)) {
          const cleaned = parsed
            .filter((i: any) => typeof i?.id === 'number' && typeof i?.commodity === 'string')
            .map(
              (i: any): CartItem => ({
                id: Number(i.id),
                commodity: String(i.commodity),
                grade: i.grade ? String(i.grade) : null,
                weightKg: Number(i.weightKg ?? 0),
                price: i.price === null || i.price === undefined ? null : Number(i.price),
                farmer: String(i.farmer ?? 'Farmer'),
                rating: Number(i.rating ?? 0),
              }),
            )
          setItems(cleaned)
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      if (items.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore storage errors
    }
  }, [items])

  const addItem: CartContextValue['addItem'] = (item) => {
    setItems((prev) => {
      if (prev.some((existing) => existing.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeItem: CartContextValue['removeItem'] = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart: CartContextValue['clearCart'] = () => {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

