import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {},
  // @ts-expect-error: serverRuntimeConfig é válido no runtime mas não tipado no NextConfig
  serverRuntimeConfig: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
}

export default nextConfig