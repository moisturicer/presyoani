import type { Metadata } from 'next'
import { DashboardFrame } from '@/components/DashboardFrame'

export const metadata: Metadata = {
  title: { template: '%s | PresyoAni', default: 'Dashboard | PresyoAni' },
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardFrame>{children}</DashboardFrame>
}
