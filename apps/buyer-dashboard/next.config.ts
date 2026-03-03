import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@presyoani/ui'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
}

export default nextConfig
