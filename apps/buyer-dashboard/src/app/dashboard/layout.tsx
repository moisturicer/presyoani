import type { Metadata } from 'next'
import { Sidebar } from '@/components/Sidebar'

export const metadata: Metadata = {
  title: { template: '%s | PresyoAni', default: 'Dashboard | PresyoAni' },
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Sidebar />
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  )
}
