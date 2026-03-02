'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, LayoutDashboard, User } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const isProfile = pathname === '/dashboard/profile'

  if (isProfile) {
    return (
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-center px-3 sm:px-6">
        <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm ring-1 ring-primary/40 transition-all hover:bg-primary/90 hover:ring-primary/50"
          >
            <Image
              src="/PresyoAni-Light.svg"
              alt="PresyoAni"
              width={18}
              height={18}
              className="h-4 w-4 object-contain"
            />
            <span className="hidden text-sm font-semibold tracking-tight text-primary-foreground sm:inline">
              PresyoAni
            </span>
          </Link>
        </div>
      </header>
    )
  }

  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) =>
      item.href === '/dashboard'
        ? pathname === '/dashboard'
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    ),
  )

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <div className="relative flex h-16 items-center px-3 sm:px-6">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm ring-1 ring-primary/40 transition-all hover:bg-primary/90 hover:ring-primary/50"
        >
          <Image
            src="/PresyoAni-Light.svg"
            alt=""
            width={18}
            height={18}
            className="h-4 w-4 object-contain"
          />
          <span className="hidden text-sm font-semibold tracking-tight text-primary-foreground sm:inline">
            PresyoAni
          </span>
        </Link>

        <nav className="absolute left-1/2 -translate-x-1/2">
          <div className="relative inline-flex h-10 items-center gap-1 rounded-full bg-primary/90 p-1 text-primary-foreground shadow-sm ring-1 ring-primary/50">
            <div
              className={cn(
                'pointer-events-none absolute left-1 top-1 h-8 w-[7.5rem] rounded-full bg-primary-foreground/15 shadow-sm transition-transform duration-300 ease-out',
                activeIndex === 1 ? 'translate-x-[calc(100%+0.25rem)]' : 'translate-x-0',
              )}
              aria-hidden
            />
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative z-10 inline-flex h-8 w-[7.5rem] items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold tracking-tight transition-colors sm:text-sm',
                    isActive ? 'text-primary-foreground' : 'text-primary-foreground/85 hover:text-primary-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="ml-auto">
          <Link
            href="/dashboard/profile"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm ring-1 ring-primary/40 transition-all hover:bg-primary/90 hover:ring-primary/50"
            aria-label="Profile"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

