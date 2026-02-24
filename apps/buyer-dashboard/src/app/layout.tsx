import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'PresyoAni',
  description:
    'Empowering the field, even when the bars are down.. Connect directly with farmers.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
