'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sprout, Camera, BarChart3, LayoutDashboard, Bell, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/field', label: 'Field', icon: Sprout },
  { href: '/dashboard/audit', label: 'Audit', icon: Camera },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Leaf className="h-8 w-8 text-sidebar-primary" />
        <span className="text-xl font-bold tracking-tight text-sidebar-foreground">
          PresyoAni
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
