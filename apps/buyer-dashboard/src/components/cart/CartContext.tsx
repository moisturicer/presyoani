'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  id: number
  crop: string
  location: string
  volume: string
  farmer: string
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'buyer-dashboard-cart'

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: 101,
    crop: 'Tomato',
    location: 'Pangasinan',
    volume: '300kg',
    farmer: 'Juan D.',
  },
  {
    id: 102,
    crop: 'Rice',
    location: 'Nueva Ecija',
    volume: '1,000kg',
    farmer: 'Maria S.',
  },
  {
    id: 103,
    crop: 'Corn',
    location: 'Tarlac',
    volume: '600kg',
    farmer: 'Pedro R.',
  },
  {
    id: 104,
    crop: 'Eggplant',
    location: 'Bulacan',
    volume: '250kg',
    farmer: 'Ana L.',
  },
  {
    id: 105,
    crop: 'Onion',
    location: 'Nueva Ecija',
    volume: '800kg',
    farmer: 'Carlos M.',
  },
]

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(DEFAULT_ITEMS)

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        setItems(parsed)
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

