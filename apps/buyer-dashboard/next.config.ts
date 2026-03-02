import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@presyoani/ui'],
  utputFileTracingRoot: path.join(__dirname, '../..'),
}

export default nextConfig
