import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {},
  serverRuntimeConfig: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
}

export default nextConfig