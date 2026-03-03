import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@presyoani/ui'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
}

export default nextConfig
